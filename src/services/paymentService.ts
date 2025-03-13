
/**
 * Payment Service
 * Handles payment processing using PayHero API
 */

export interface PaymentResponse {
  success: boolean;
  data?: {
    reference: string;
    status: string;
  };
  error?: string;
}

export class PaymentProcessor {
  private apiUsername: string;
  private apiPassword: string;
  private baseUrl: string;
  private credentials: string;
  private pendingTransactions: Map<string, any>;
  
  constructor() {
    this.apiUsername = 'hYakRT5HZaNPofgw3LSP';
    this.apiPassword = 'ECsKFTrPKQHdfCa63HPDgMeW';
    this.baseUrl = 'https://backend.payhero.co.ke/api/v2/';
    this.credentials = btoa(`${this.apiUsername}:${this.apiPassword}`);
    this.pendingTransactions = new Map();
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
        channel_id: '1487',
        external_reference: `trivia_${Date.now()}`,
        provider: 'm-pesa',
        callback_url: window.location.href
      };

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
        throw new Error(errorData.message || 'Payment initiation failed');
      }

      const data = await response.json();
      this.pendingTransactions.set(data.reference, { 
        amount, 
        phone: formattedPhone, 
        status: 'pending' 
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

  async checkTransactionStatus(reference: string): Promise<string> {
    try {
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
      return data.status;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentProcessor();
