import Image from "next/image";
import FileStructureGenerator from "../components/FileStructureGenerator/Generator";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FileStructureGenerator />
    </div>
  );
}
