import OrderDetailsComponent from "@/components/OrderDetailsComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

type Props = {
  params: {
    id: string;
  };
};

export default function OrderDetailsPage({ params }: Props) {
  const orderId = params.id;

  return (
    <DefaultLayout>
      <OrderDetailsComponent orderId={orderId} />
    </DefaultLayout>
  );
}
