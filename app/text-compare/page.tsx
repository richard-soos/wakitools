import TextCompare from "@/components/pages/TextCompare";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Compare | WakiTools Free",
  description: "Wakidu's tool lib.",
};

const TextComparePage = () => {
  return <TextCompare />;
};

export default TextComparePage;
