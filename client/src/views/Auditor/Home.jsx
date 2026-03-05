import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import EvidenceForm from "../../components/EvidenceForm";

export default function Home() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    
    <EvidenceForm
      user={user}
      orderId={11}
    />
  );
}