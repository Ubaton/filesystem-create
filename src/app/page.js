import Image from "next/image";
import FileStructureGenerator from "../components/FileStructureGenerator/Generator";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FileStructureGenerator />
    </div>
  );
}
