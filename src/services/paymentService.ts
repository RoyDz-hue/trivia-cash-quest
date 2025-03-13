
/**
 * Payment Service
 * Handles payment processing using PayHero API
 */

export interface PaymentResponse {
  success: boolean;
  data?: {
    reference: string;
    status: string;
    CheckoutRequestID?: string;
  };
  error?: string;
}

export interface WithdrawalResponse {
  success: boolean;
  data?: {
    merchant_reference: string;
    status: string;
    checkout_request_id?: string;
  };
  error?: string;
}

export enum TransactionStatus {
  QUEUED = 'QUEUED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export class PaymentProcessor {
  private apiUsername: string;
  private apiPassword: string;
  private baseUrl: string;
  private credentials: string;
  private pendingTransactions: Map<string, any>;
  private activeChecks: Map<string, any>;
  private depositChannelId: string;
  private withdrawalChannelId: string;
  
  constructor() {
    this.apiUsername = 'hYakRT5HZaNPofgw3LSP';
    this.apiPassword = 'ECsKFTrPKQHdfCa63HPDgMdYS7rXSxaX0GlwBMeW';
    this.baseUrl = 'https://backend.payhero.co.ke/api/v2/';
    this.credentials = btoa(`${this.apiUsername}:${this.apiPassword}`);
    this.pendingTransactions = new Map();
    this.activeChecks = new Map();
    
    // Initialize with default values, will be overridden if values exist in localStorage
    this.depositChannelId = localStorage.getItem('depositChannelId') || '1487';
    this.withdrawalChannelId = localStorage.getItem('withdrawalChannelId') || '1487';
  }

  // Getters and setters for channel IDs
  getDepositChannelId(): string {
    return this.depositChannelId;
  }

  setDepositChannelId(channelId: string): void {
    this.depositChannelId = channelId;
    localStorage.setItem('depositChannelId', channelId);
  }

  getWithdrawalChannelId(): string {
    return this.withdrawalChannelId;
  }

  setWithdrawalChannelId(channelId: string): void {
    this.withdrawalChannelId = channelId;
    localStorage.setItem('withdrawalChannelId', channelId);
  }

  private formatPhoneNumber(phone: string): string {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 9) return '254' + phone;
    if (phone.length === 10 && phone.startsWith('0')) return '254' + phone.slice(1);
    return phone.replace(/^(?:254|\+254|0)(\d{9})$/, '254$1');
  }

  async initiateSTKPush(amount: number, phone: string): Promise<PaymentResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      if (!formattedPhone.match(/^254\d{9}$/)) {
        throw new Error('Invalid phone number');
      }

      const payload = {
        amount: parseInt(amount.toString()),
        phone_number: formattedPhone,
        channel_id: this.depositChannelId,
        external_reference: `trivia_${Date.now()}`,
        provider: 'm-pesa',
        callback_url: window.location.href
      };

      console.log('Initiating STK push with payload:', payload);

      const response = await fetch(`${this.baseUrl}payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('STK push failed:', errorData);
        throw new Error(errorData.message || 'Payment initiation failed');
      }

      const data = await response.json();
      console.log('STK push response:', data);
      
      this.pendingTransactions.set(data.reference, { 
        amount, 
        phone: formattedPhone, 
        status: data.status || 'QUEUED' 
      });

      return { 
        success: true, 
        data 
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      };
    }
  }

  async withdrawToMobile(amount: number, phone: string): Promise<WithdrawalResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      if (!formattedPhone.match(/^254\d{9}$/)) {
        throw new Error('Invalid phone number');
      }

      // Network code 63902 is for M-Pesa
      const payload = {
        amount: parseInt(amount.toString()),
        phone_number: formattedPhone,
        network_code: '63902', 
        external_reference: `trivia_withdraw_${Date.now()}`,
        channel: 'mobile',
        channel_id: this.withdrawalChannelId,
        payment_service: 'b2c',
        callback_url: window.location.href
      };

      console.log('Initiating withdrawal with payload:', payload);

      const response = await fetch(`${this.baseUrl}withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Withdrawal failed:', errorData);
        throw new Error(errorData.message || 'Withdrawal initiation failed');
      }

      const data = await response.json();
      console.log('Withdrawal response:', data);

      return { 
        success: true, 
        data 
      };
    } catch (error) {
      console.error('Withdrawal error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown withdrawal error'
      };
    }
  }

  async checkTransactionStatus(reference: string): Promise<string> {
    try {
      console.log(`Checking transaction status for reference: ${reference}`);
      
      const response = await fetch(
        `${this.baseUrl}transaction-status?reference=${reference}`, 
        { 
          headers: { 
            'Authorization': `Basic ${this.credentials}` 
          } 
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Transaction status response:', data);
      
      return data.status;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  startStatusCheck(reference: string, onStatusChange: (status: string) => void) {
    // Only start a new check if one isn't already running for this reference
    if (this.activeChecks.has(reference)) {
      return;
    }

    console.log(`Starting status check for reference: ${reference}`);
    
    const checkInterval = setInterval(async () => {
      try {
        const status = await this.checkTransactionStatus(reference);
        console.log(`Status for ${reference}: ${status}`);
        
        onStatusChange(status);
        
        if (status === TransactionStatus.SUCCESS || status === TransactionStatus.FAILED) {
          this.stopStatusCheck(reference);
        }
      } catch (error) {
        console.error(`Error checking status for ${reference}:`, error);
      }
    }, 5000);
    
    this.activeChecks.set(reference, checkInterval);
  }

  stopStatusCheck(reference: string) {
    const interval = this.activeChecks.get(reference);
    if (interval) {
      clearInterval(interval);
      this.activeChecks.delete(reference);
      console.log(`Stopped status check for ${reference}`);
    }
  }

  stopAllStatusChecks() {
    this.activeChecks.forEach((interval) => clearInterval(interval));
    this.activeChecks.clear();
    console.log('Stopped all status checks');
  }
}

// Export singleton instance
export const paymentService = new PaymentProcessor();
