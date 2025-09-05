import React, { useState } from "react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import PriorityBadge from "@/components/molecules/PriorityBadge";

const AssignmentList = ({ assignments = [], courses = [], onToggleComplete, onEdit }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const getCourseName = (courseId) => {
const actualCourseId = courseId?.Id || courseId;
    const course = courses.find(c => c.Id.toString() === actualCourseId.toString());
    return course ? `${course.code_c} - ${course.Name}` : "Unknown Course";
  };

const getCourseColor = (courseId) => {
    const actualCourseId = courseId?.Id || courseId;
    const course = courses.find(c => c.Id.toString() === actualCourseId.toString());
    return course?.color_c || "#6B7280";
  };

  const getDueDateLabel = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return "Overdue";
    return format(date, "MMM d");
  };

  const getDueDateColor = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date)) return "text-red-600 bg-red-100";
    if (isToday(date)) return "text-orange-600 bg-orange-100";
    if (isTomorrow(date)) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const filteredAssignments = assignments.filter(assignment => {
    switch (filter) {
      case "todo":
return assignment.status_c === "todo";
      case "completed":
        return assignment.status_c === "completed";
      case "overdue":
        return assignment.status_c === "todo" && isPast(new Date(assignment.due_date_c));
      default:
        return true;
    }
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
case "dueDate":
        return new Date(a.due_date_c) - new Date(b.due_date_c);
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority_c] - priorityOrder[a.priority_c];
      case "course":
        return getCourseName(a.course_id_c).localeCompare(getCourseName(b.course_id_c));
      default:
        return 0;
    }
  });

const filterOptions = [
    { value: "all", label: "All", count: assignments.length },
    { value: "todo", label: "To Do", count: assignments.filter(a => a.status_c === "todo").length },
    { value: "completed", label: "Completed", count: assignments.filter(a => a.status_c === "completed").length },
    { value: "overdue", label: "Overdue", count: assignments.filter(a => a.status_c === "todo" && isPast(new Date(a.due_date_c))).length }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === option.value
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="course">Sort by Course</option>
        </select>
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {sortedAssignments.map((assignment) => (
          <Card key={assignment.Id} className="transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onToggleComplete?.(assignment.Id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
assignment.status_c === "completed"
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-primary-500"
                }`}
              >
{assignment.status_c === "completed" && (
                  <ApperIcon name="Check" className="w-3 h-3" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
<h3 className={`font-medium ${
                      assignment.status_c === "completed" 
                        ? "text-gray-500 line-through" 
                        : "text-gray-900"
                    }`}>
                      {assignment.title_c}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-2">
                        <div 
className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCourseColor(assignment.course_id_c) }}
                        />
                        <span className="text-sm text-gray-600">
                          {getCourseName(assignment.course_id_c)}
                        </span>
                      </div>
                      
                      <Badge 
size="sm" 
                        className={getDueDateColor(assignment.due_date_c)}
                      >
                        {getDueDateLabel(assignment.due_date_c)}
                      </Badge>
<PriorityBadge priority={assignment.priority_c} showIcon={false} />
                    </div>
                  </div>

                  <button
                    onClick={() => onEdit?.(assignment)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                  </button>
                </div>

{assignment.description_c && (
                  <p className="text-sm text-gray-500 mt-2">
                    {assignment.description_c}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedAssignments.length === 0 && (
        <Card className="text-center py-12">
          <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No assignments found
          </h3>
          <p className="text-gray-600">
            {filter === "all" 
              ? "Start organizing your tasks by adding your first assignment"
              : `No assignments match the "${filterOptions.find(o => o.value === filter)?.label}" filter`
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default AssignmentList;