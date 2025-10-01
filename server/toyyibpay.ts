const TOYYIBPAY_BASE_URL = 'https://toyyibpay.com';

interface CreateCategoryResponse {
  CategoryCode: string;
}

interface CreateBillResponse {
  BillCode: string;
}

interface BillTransaction {
  billpaymentStatus: string;
  billpaymentAmount: string;
  billpaymentInvoiceNo: string;
}

let categoryCode: string | null = null;

async function ensureCategoryExists(): Promise<string> {
  if (categoryCode) {
    return categoryCode;
  }

  if (!process.env.TOYYIBPAY_SECRET_KEY) {
    throw new Error('TOYYIBPAY_SECRET_KEY not configured');
  }

  try {
    const response = await fetch(`${TOYYIBPAY_BASE_URL}/index.php/api/createCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        catname: 'AECOIN Store',
        catdescription: 'GTA Online virtual currency packages',
        userSecretKey: process.env.TOYYIBPAY_SECRET_KEY,
      }),
    });

    const responseText = await response.text();
    
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse ToyyibPay response:', responseText);
      throw new Error(`ToyyibPay API error: ${responseText}`);
    }
    
    const catCode: string | undefined = Array.isArray(data) ? data[0]?.CategoryCode : data?.CategoryCode;
    
    if (!catCode) {
      console.error('Invalid category response:', data);
      throw new Error(`Failed to create ToyyibPay category: ${responseText}`);
    }

    categoryCode = catCode as string;
    console.log('✓ ToyyibPay category created:', categoryCode);
    
    return categoryCode;
  } catch (error) {
    console.error('ToyyibPay category creation error:', error);
    throw error;
  }
}

export async function createBill(params: {
  billName: string;
  billDescription: string;
  billAmount: number;
  billTo: string;
  billEmail: string;
  billPhone: string;
  billExternalReferenceNo: string;
  billReturnUrl: string;
  billCallbackUrl: string;
}): Promise<string> {
  if (!process.env.TOYYIBPAY_SECRET_KEY) {
    throw new Error('TOYYIBPAY_SECRET_KEY not configured');
  }

  const catCode = await ensureCategoryExists();

  try {
    const response = await fetch(`${TOYYIBPAY_BASE_URL}/index.php/api/createBill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        userSecretKey: process.env.TOYYIBPAY_SECRET_KEY,
        categoryCode: catCode,
        billName: params.billName,
        billDescription: params.billDescription,
        billPriceSetting: '1',
        billPayorInfo: '1',
        billAmount: String(Math.round(params.billAmount * 100)),
        billReturnUrl: params.billReturnUrl,
        billCallbackUrl: params.billCallbackUrl,
        billExternalReferenceNo: params.billExternalReferenceNo,
        billTo: params.billTo,
        billEmail: params.billEmail,
        billPhone: params.billPhone || '0000000000',
        billPaymentChannel: '2',
        billChargeToCustomer: '1',
      }),
    });

    const data = await response.json() as CreateBillResponse[];
    
    if (!data || !data[0]?.BillCode) {
      throw new Error('Failed to create ToyyibPay bill');
    }

    const billCode = data[0].BillCode;
    console.log('✓ ToyyibPay bill created:', billCode);
    
    return billCode;
  } catch (error) {
    console.error('ToyyibPay bill creation error:', error);
    throw error;
  }
}

export function getPaymentUrl(billCode: string): string {
  return `${TOYYIBPAY_BASE_URL}/${billCode}`;
}

export async function getBillTransactions(billCode: string): Promise<BillTransaction[]> {
  try {
    const response = await fetch(`${TOYYIBPAY_BASE_URL}/index.php/api/getBillTransactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        billCode: billCode,
        billpaymentStatus: '1',
      }),
    });

    const data = await response.json() as BillTransaction[];
    return data || [];
  } catch (error) {
    console.error('ToyyibPay transaction check error:', error);
    return [];
  }
}
