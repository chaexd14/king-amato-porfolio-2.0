import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-text-muted font-pixel text-2xl">Hello World</h1>
      <h1 className="text-text-muted font-pixel text-2xl">01</h1>
      <Image 
        src="/king-amato.jpg"
        alt="King Amato"
        width={500}
        height={500}
      />
    </div>
  );
}
