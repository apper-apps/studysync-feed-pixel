import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AssignmentList from "@/components/organisms/AssignmentList";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import SearchBar from "@/components/molecules/SearchBar";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const loadData = async () => {
try {
      setError("");
      setLoading(true);
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData || []);
      setCourses(coursesData || []);
      setFilteredAssignments(assignmentsData || []);
    } catch (err) {
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

useEffect(() => {
    let filtered = assignments;
    
    if (selectedCourse !== "all") {
      filtered = filtered.filter(assignment => {
        const courseId = assignment.course_id_c?.Id || assignment.course_id_c;
        return courseId && courseId.toString() === selectedCourse.toString();
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAssignments(filtered);
  }, [assignments, selectedCourse, searchTerm]);

  const handleToggleComplete = async (assignmentId) => {
    try {
      const updatedAssignment = await assignmentService.toggleComplete(assignmentId);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.Id === assignmentId ? updatedAssignment : assignment
        )
      );
      toast.success(
        updatedAssignment.status === "completed" 
          ? "Assignment marked as complete!" 
          : "Assignment marked as incomplete"
      );
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const handleEditAssignment = (assignment) => {
    // In a real app, this would open an edit modal
    toast.info(`Edit functionality for "${assignment.title}" would open here`);
  };

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />;
  }

const courseFilters = courses.map(course => ({
    value: course.Id.toString(),
    label: `${course.code_c} - ${course.Name}`
  }));

  // Calculate statistics
const totalAssignments = assignments.length;
  const completedCount = assignments.filter(a => a.status_c === "completed").length;
  const todoCount = assignments.filter(a => a.status_c === "todo").length;
  const completionRate = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Assignments
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your academic tasks and deadlines
          </p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowQuickAdd(true)}
        >
          Add Assignment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalAssignments}
          </div>
          <div className="text-sm text-gray-600">Total Assignments</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {todoCount}
          </div>
          <div className="text-sm text-gray-600">To Do</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {completedCount}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search assignments..."
          className="flex-1"
        />
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="input-field w-auto min-w-[200px]"
          >
            <option value="all">All Courses</option>
            {courseFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <Empty 
          type="assignments"
          onAction={() => setShowQuickAdd(true)}
        />
      ) : (
        <AssignmentList
          assignments={filteredAssignments}
          courses={courses}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditAssignment}
        />
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => {
          setShowQuickAdd(false);
          loadData(); // Reload data when modal closes
        }}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;