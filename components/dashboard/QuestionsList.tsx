import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
import { QuestionCategory } from "@/app/(main)/dashboard/create-interview/page";
import { Button } from "../ui/button";

const QuestionsList = ({
  questionsCategories,
  isLoading,
  onSubmit
}: {
  questionsCategories: QuestionCategory[] | undefined;
  isLoading: boolean;
  onSubmit: () => void;
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 6; // reduce per page to make it visually balanced

  if (isLoading) {
    return (
      <div className="p-5 my-5 w-full flex items-center justify-center bg-blue-100 rounded-lg">
        <Loader2 className="animate-spin" />
        <div className="ml-4 flex flex-col items-start justify-center">
          <p className="font-semibold">Generating Interview Questions...</p>
          <p className="text-sm text-gray-700">
            Our AI is crafting personalized questions for your interview based
            on your job position.
          </p>
        </div>
      </div>
    );
  }

  // Flatten all questions from all categories into one array
  const allQuestions =
    questionsCategories?.flatMap((cat) =>
      cat.questions.map((q) => ({ ...q, category: cat.category }))
    ) || [];

  const totalPages = Math.ceil(allQuestions.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedQuestions = allQuestions.slice(startIndex, endIndex);

  return (
    <div id="form" className="w-full my-5 bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Interview Questions
      </h2>

      <div className="space-y-4">
        {paginatedQuestions.map((q, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-md transition"
          >
            {/* Category */}
            <h4 className="text-sm font-semibold text-blue-600 mb-1">
              {q.category}
            </h4>

            {/* Question */}
            <p className="text-gray-900 font-medium">{q.question}</p>

            {/* Metadata */}
            <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                {q.type}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md">
                {q.difficulty}
              </span>
            </div>

            {/* Evaluation Criteria */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 font-semibold">
                Evaluation Criteria:
              </p>
              <p className="text-sm text-gray-700">{q.evaluation_criteria}</p>
            </div>


            {/* Follow-ups */}
            {q.follow_ups && q.follow_ups.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 font-semibold">
                  Follow-up Questions:
                </p>
                <ul className="list-disc list-inside ml-3 space-y-1 text-sm text-gray-700">
                  {q.follow_ups.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            )}


          </div>
        ))} 

        <div className="p-3 w-full flex justify-end">
           <Button onClick={onSubmit}>Finish</Button>  
        </div>   
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default QuestionsList;