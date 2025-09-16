type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export function SoldProductsList({ products }: { products: Product[] }) {
  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-lg font-medium mb-4">Sold Products</h2>
      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{product.name} × {product.quantity}</span>
            <span className="font-semibold">₹{product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
