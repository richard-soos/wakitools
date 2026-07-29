import TextCounter from "@/components/pages/TextCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Counter | WakiTools Free",
  description: "Wakidu's tool lib.",
};

const TextCounterPage = () => {
  return <TextCounter />;
};

export default TextCounterPage;
