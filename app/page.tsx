import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
