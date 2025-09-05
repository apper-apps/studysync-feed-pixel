import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { scheduleService } from "@/services/api/scheduleService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);

      const [coursesData, assignmentsData, scheduleData, upcomingData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        scheduleService.getTodaysSchedule(),
        assignmentService.getUpcoming(7)
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
      setTodaySchedule(scheduleData);
      setUpcomingAssignments(upcomingData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadDashboardData} />;
  }

  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const pendingAssignments = assignments.filter(a => a.status === "todo").length;
  const overdueAssignments = assignments.filter(a => a.status === "todo" && isPast(new Date(a.dueDate))).length;

  // Calculate overall GPA
  const overallGPA = courses.reduce((total, course) => {
    const courseGrade = course.gradeCategories?.reduce((sum, category) => {
      const categoryAvg = category.grades?.reduce((gradeSum, grade) => gradeSum + grade.score, 0) / (category.grades?.length || 1);
      return sum + (categoryAvg * category.weight / 100);
    }, 0) || 0;
    return total + courseGrade;
  }, 0) / courses.length || 0;

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.Id.toString() === courseId.toString());
    return course ? course.code : "Unknown";
  };

  const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id.toString() === courseId.toString());
    return course?.color || "#6B7280";
  };

  const getDueDateLabel = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const getDueDateColor = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date)) return "text-red-600";
    if (isToday(date)) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 font-display">
          Welcome back! 👋
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your studies today
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon="BookOpen"
          color="primary"
          description="This semester"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingAssignments}
          icon="Clock"
          color="warning"
          description={`${totalAssignments} total assignments`}
        />
        <StatCard
          title="Completed"
          value={completedAssignments}
          icon="CheckCircle"
          color="success"
          description={`${Math.round((completedAssignments / totalAssignments) * 100)}% completion rate`}
        />
        <StatCard
          title="Overall GPA"
          value={overallGPA.toFixed(2)}
          icon="Award"
          color="accent"
          description="Current standing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Today's Schedule
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              icon="Calendar"
              onClick={() => navigate("/schedule")}
            >
              View All
            </Button>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No classes scheduled for today</p>
              <p className="text-sm text-gray-500 mt-1">Enjoy your free day! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.slice(0, 4).map((schedule) => {
                const course = courses.find(c => c.Id.toString() === schedule.courseId.toString());
                return (
                  <div key={schedule.Id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-3 h-12 rounded-full mr-3"
                      style={{ backgroundColor: course?.color || "#6B7280" }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {course?.code || "Unknown Course"}
                      </h3>
                      <p className="text-sm text-gray-600">{course?.name}</p>
                      <p className="text-xs text-gray-500">
                        📍 {schedule.location}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div className="font-medium">{schedule.startTime} - {schedule.endTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Upcoming Deadlines
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              icon="FileText"
              onClick={() => navigate("/assignments")}
            >
              View All
            </Button>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming deadlines</p>
              <p className="text-sm text-gray-500 mt-1">You're all caught up! ✨</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.slice(0, 5).map((assignment) => (
                <div key={assignment.Id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3 flex-1">
                    <div 
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: getCourseColor(assignment.courseId) }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getCourseName(assignment.courseId)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getDueDateColor(assignment.dueDate)}`}>
                    {getDueDateLabel(assignment.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/assignments")}
          >
            <ApperIcon name="Plus" className="w-6 h-6" />
            <span className="text-sm">Add Assignment</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/courses")}
          >
            <ApperIcon name="BookOpen" className="w-6 h-6" />
            <span className="text-sm">Add Course</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/schedule")}
          >
            <ApperIcon name="Calendar" className="w-6 h-6" />
            <span className="text-sm">View Schedule</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/grades")}
          >
            <ApperIcon name="Award" className="w-6 h-6" />
            <span className="text-sm">Check Grades</span>
          </Button>
        </div>
      </Card>

      {/* Overdue Assignments Alert */}
      {overdueAssignments > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-500" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">
                {overdueAssignments} Overdue Assignment{overdueAssignments > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-red-700">
                You have assignments that are past their due date. Review and complete them as soon as possible.
              </p>
            </div>
            <Button 
              variant="accent" 
              size="sm"
              onClick={() => navigate("/assignments?filter=overdue")}
            >
              Review
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;