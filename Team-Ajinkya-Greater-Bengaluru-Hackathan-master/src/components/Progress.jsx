import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

const RiskMonitor = () => {
  const [riskLevel, setRiskLevel] = useState("Loading...");
  const [riskScore, setRiskScore] = useState(0);
  const [riskPercentage, setRiskPercentage] = useState(0);

  const fetchRiskData = async () => {
    try {
      const response = await axios.get("/risk");
      setRiskLevel(response.data.risk_level);
      setRiskScore(response.data.score);
      setRiskPercentage(response.data.risk_percentage);
    } catch (error) {
      console.error("Error fetching risk data", error);
    }
  };

  useEffect(() => {
    fetchRiskData();
    const interval = setInterval(fetchRiskData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartExam = async () => {
    try {
      const response = await axios.post("/start_exam");
      alert(response.data.message);
    } catch (error) {
      alert("Error: " + error.response.data.error);
    }
  };

  const handleStartQuestion = async () => {
    try {
      const response = await axios.post("/start_question", {
        question_type: "mcq",
        question_id: "Q1",
      });
      alert(response.data.message + " (Attempt: " + response.data.attempt_count + ")");
    } catch (error) {
      alert("Error: " + error.response.data.error);
    }
  };

  const handleSubmitQuestion = async () => {
    try {
      const response = await axios.post("/submit_question");
      alert("Question Submitted! Risk Score: " + response.data.risk_score);
    } catch (error) {
      alert("Error: " + error.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md p-6 text-center shadow-xl">
        <h2 className="text-2xl font-bold">User Activity Risk Monitor</h2>
        <p className="text-gray-600">Live risk analysis based on keyboard & mouse activity</p>
        <hr className="my-4" />
        <h4 className="text-lg font-semibold">Risk Level:</h4>
        <p className="text-xl font-bold text-red-600">{riskLevel}</p>
        <h4 className="text-lg font-semibold">Risk Progress:</h4>
        <Progress value={riskPercentage} className="w-full h-4" />
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleStartExam} className="bg-blue-500">Start Exam</Button>
          <Button onClick={handleStartQuestion} className="bg-gray-500">Next Question</Button>
          <Button onClick={handleSubmitQuestion} className="bg-green-500">Submit Question</Button>
        </div>
      </Card>
    </div>
  );
};

export default RiskMonitor;