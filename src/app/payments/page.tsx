import PaymentForm from '../../components/PaymentForm';

export default function Payments() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-sda-blue mb-6">Make a Payment</h1>
      <PaymentForm />
    </div>
  );
}