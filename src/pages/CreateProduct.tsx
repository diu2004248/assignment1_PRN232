import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductForm } from "@/components/products/ProductForm";
import { useCreateProduct } from "@/hooks/useProducts";
import { ProductInsert } from "@/lib/supabase";

export default function CreateProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: ProductInsert) => {
    await createProduct.mutateAsync(data);
    navigate("/");
  };

  return (
    <Layout>
      <div className="container py-12">
        <ProductForm 
          onSubmit={handleSubmit}
          isSubmitting={createProduct.isPending}
        />
      </div>
    </Layout>
  );
}
