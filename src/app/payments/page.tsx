// src/app/payments/page.tsx - UPDATED VERSION
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  Check,
  Wallet,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input'; 
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext'; // Added
import ProtectedRoute from '@/components/ProtectedRoute'; // Added
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'; // Added

type PaymentMethod = 'card' | 'mpesa' | 'paypal';
type OfferingType = 'combined' | 'offering' | 'tithe' | 'camp_meeting' | 'total';

const PaymentsPage = () => {
  const { user } = useAuth(); // Added authentication context
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [selectedOffering, setSelectedOffering] = useState<OfferingType>('tithe');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amounts, setAmounts] = useState<Record<OfferingType, number>>({
    combined: 0,
    offering: 0,
    tithe: 0,
    camp_meeting: 0,
    total: 0
  });

  // Form states
  const [cardForm, setCardForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [mpesaForm, setMpesaForm] = useState({
    phoneNumber: ''
  });

  const paymentMethods = [
    { 
      id: 'card' as PaymentMethod, 
      name: 'Credit Card', 
      icon: CreditCard,
      description: 'Pay with Visa, Mastercard'
    },
    { 
      id: 'mpesa' as PaymentMethod, 
      name: 'M-Pesa', 
      icon: Smartphone,
      description: 'Pay via M-Pesa'
    },
    { 
      id: 'paypal' as PaymentMethod, 
      name: 'PayPal', 
      icon: Wallet,
      description: 'Pay with PayPal'
    },
  ];

  const offeringTypes = [
    { id: 'combined' as OfferingType, name: 'Combined Offering', description: 'All offerings combined' },
    { id: 'offering' as OfferingType, name: 'General Offering', description: 'Regular church offering' },
    { id: 'tithe' as OfferingType, name: 'Tithe (10%)', description: '10% of income' },
    { id: 'camp_meeting' as OfferingType, name: 'Camp Meeting', description: 'Camp meeting offering' },
    { id: 'total' as OfferingType, name: 'Total Offering', description: 'Accumulated offering' },
  ];

  const handleAmountChange = (type: OfferingType, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmounts(prev => ({ ...prev, [type]: numValue }));
  };

  const getTotalAmount = () => {
    if (selectedOffering === 'total') {
      return Object.entries(amounts)
        .filter(([key]) => key !== 'total')
        .reduce((sum, [, val]) => sum + val, 0);
    }
    return amounts[selectedOffering];
  };

  const handleProceed = () => {
    if (getTotalAmount() > 0) {
      setShowPaymentModal(true);
    }
  };

  const handlePayment = () => {
    // Handle payment logic here
    console.log('Processing payment:', {
      method: selectedMethod,
      offering: selectedOffering,
      amount: getTotalAmount(),
      ...(selectedMethod === 'card' ? cardForm : {}),
      ...(selectedMethod === 'mpesa' ? mpesaForm : {})
    });
    setShowPaymentModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Payment
            </h1>
            <p className="text-muted-foreground">
              Choose payment method below
            </p>
          </motion.div>

          {/* Payment Methods */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <motion.button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    isSelected 
                      ? 'border-accent bg-accent/5 shadow-gold' 
                      : 'border-border bg-card hover:border-accent/50'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </motion.div>
                  )}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-accent/10' : 'bg-muted'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Offering Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                {/* Secure Header */}
                <div className="bg-gradient-navy rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-cream font-semibold text-lg">Secure Payment</h3>
                    <p className="text-cream/70 text-sm">BlessPay - SDA Offering System</p>
                  </div>
                  <Shield className="w-8 h-8 text-gold" />
                </div>

                {/* Offering Type Selection */}
                <div className="mb-6">
                  <Label className="text-foreground font-medium mb-3 block">Offering Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {offeringTypes.map((offering) => {
                      const isSelected = selectedOffering === offering.id;
                      return (
                        <motion.button
                          key={offering.id}
                          onClick={() => setSelectedOffering(offering.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-accent bg-accent/5' 
                              : 'border-border hover:border-accent/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                              {offering.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-accent" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{offering.description}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-4">
                  {selectedOffering === 'total' ? (
                    <div className="space-y-3">
                      {offeringTypes.filter(o => o.id !== 'total' && o.id !== 'combined').map((offering) => (
                        <div key={offering.id} className="flex items-center gap-3">
                          <Label className="text-sm text-muted-foreground w-32">{offering.name}</Label>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">KES</span>
                            <Input
                              type="number"
                              value={amounts[offering.id] || ''}
                              onChange={(e) => handleAmountChange(offering.id, e.target.value)}
                              className="pl-12 border-border focus:border-accent focus:ring-accent"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <Label className="text-foreground font-medium mb-2 block">Amount (KES)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">KES</span>
                        <Input
                          type="number"
                          value={amounts[selectedOffering] || ''}
                          onChange={(e) => handleAmountChange(selectedOffering, e.target.value)}
                          className="pl-14 py-6 text-lg border-border focus:border-accent focus:ring-accent"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Summary & Action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">Payment Summary</h3>
                
                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Offering Type</span>
                    <span className="font-medium text-foreground">
                      {offeringTypes.find(o => o.id === selectedOffering)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium text-foreground">
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-sm text-foreground bg-muted px-2 py-1 rounded">
                      BLESS_{Date.now().toString().slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-accent/5 rounded-xl px-4 -mx-4">
                    <span className="font-semibold text-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-accent">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 mb-6 py-4 border-t border-border">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Shield className="w-4 h-4" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Encrypted</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={handleProceed}
                  disabled={getTotalAmount() <= 0}
                  className="w-full py-6 text-lg font-semibold bg-accent hover:bg-gold-dark text-accent-foreground rounded-xl shadow-gold transition-all duration-300"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay {formatCurrency(getTotalAmount())}
                </Button>
              </div>

              {/* Spiritual Quote */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-6 bg-accent/5 rounded-2xl border border-accent/20"
              >
                <p className="text-foreground/80 italic text-center font-serif">
                  "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                </p>
                <p className="text-muted-foreground text-center text-sm mt-2">— 2 Corinthians 9:7</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Payment Modal */}
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    {selectedMethod === 'card' && <CreditCard className="w-5 h-5 text-accent" />}
                    {selectedMethod === 'mpesa' && <Smartphone className="w-5 h-5 text-accent" />}
                    {selectedMethod === 'paypal' && <Wallet className="w-5 h-5 text-accent" />}
                  </div>
                  Pay with {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {selectedMethod === 'card' && (
                  <>
                    <div>
                      <Label className="text-muted-foreground text-sm">CARDHOLDER'S NAME</Label>
                      <Input 
                        placeholder="John Doe"
                        value={cardForm.cardholderName}
                        onChange={(e) => setCardForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                        className="mt-1 border-border focus:border-accent"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">CARD NUMBER</Label>
                      <Input 
                        placeholder="1234 5678 9012 3456"
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                        className="mt-1 border-border focus:border-accent"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-muted-foreground text-sm">EXP. MONTH</Label>
                        <Input 
                          placeholder="MM"
                          value={cardForm.expiryMonth}
                          onChange={(e) => setCardForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                          className="mt-1 border-border focus:border-accent"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">EXP. YEAR</Label>
                        <Input 
                          placeholder="YY"
                          value={cardForm.expiryYear}
                          onChange={(e) => setCardForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                          className="mt-1 border-border focus:border-accent"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">CVC</Label>
                        <Input 
                          placeholder="123"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                          className="mt-1 border-border focus:border-accent"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedMethod === 'mpesa' && (
                  <div>
                    <Label className="text-muted-foreground text-sm">M-PESA PHONE NUMBER</Label>
                    <Input 
                      placeholder="+254 7XX XXX XXX"
                      value={mpesaForm.phoneNumber}
                      onChange={(e) => setMpesaForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="mt-1 border-border focus:border-accent"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You will receive an M-Pesa prompt on this number to complete the payment.
                    </p>
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="text-center py-4">
                    <Wallet className="w-16 h-16 text-accent mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      You will be redirected to PayPal to complete your payment of {formatCurrency(getTotalAmount())}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Amount to pay</span>
                    <span className="text-xl font-bold text-accent">{formatCurrency(getTotalAmount())}</span>
                  </div>
                  <Button 
                    onClick={handlePayment}
                    className="w-full py-5 bg-accent hover:bg-gold-dark text-accent-foreground font-semibold rounded-xl"
                  >
                    {selectedMethod === 'paypal' ? 'Continue to PayPal' : `Pay ${formatCurrency(getTotalAmount())}`}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
};

export default PaymentsPage;