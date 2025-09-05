import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import WeeklySchedule from "@/components/organisms/WeeklySchedule";
import { scheduleService } from "@/services/api/scheduleService";
import { courseService } from "@/services/api/courseService";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [schedulesData, coursesData] = await Promise.all([
        scheduleService.getAll(),
        courseService.getAll()
      ]);
      setSchedules(schedulesData || []);
      setCourses(coursesData || []);
    } catch (err) {
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSchedule = async (scheduleData) => {
    try {
      const newSchedule = await scheduleService.create(scheduleData);
      if (newSchedule) {
        setSchedules(prev => [...prev, newSchedule]);
        setShowAddModal(false);
        toast.success("Class time added successfully!");
      }
    } catch (err) {
      toast.error("Failed to add class time");
    }
  };

  if (loading) {
    return <Loading type="schedule" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />;
  }

const totalHours = schedules.reduce((total, schedule) => {
    const start = parseInt(schedule.start_time_c?.split(":")[0] || "0");
    const end = parseInt(schedule.end_time_c?.split(":")[0] || "0");
    return total + (end - start);
  }, 0);
  const daysWithClasses = [...new Set(schedules.map(s => s.dayOfWeek))].length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Class Schedule
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage your weekly class timetable
          </p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowAddModal(true)}
        >
          Add Class Time
        </Button>
      </div>

      {/* Schedule Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {courses.length}
          </div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {totalHours}
          </div>
          <div className="text-sm text-gray-600">Hours Per Week</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {daysWithClasses}
          </div>
          <div className="text-sm text-gray-600">Days With Classes</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {schedules.length}
          </div>
          <div className="text-sm text-gray-600">Class Sessions</div>
        </Card>
      </div>

      {/* Weekly Schedule */}
      {schedules.length === 0 ? (
        <Empty 
          type="schedule"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <WeeklySchedule schedules={schedules} courses={courses} />
      )}

      {/* Today's Classes */}
      <TodayClasses schedules={schedules} courses={courses} />

      {/* Add Schedule Modal */}
      <AddScheduleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSchedule}
        courses={courses}
      />
    </div>
  );
};

const TodayClasses = ({ schedules, courses }) => {
  const today = new Date();
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const todayName = days[today.getDay()];
  
const todaySchedules = schedules
    .filter(schedule => schedule.day_of_week_c?.toLowerCase() === todayName)
    .sort((a, b) => {
      const aTime = parseInt(a.start_time_c?.replace(":", "") || "0");
      const bTime = parseInt(b.start_time_c?.replace(":", "") || "0");
      return aTime - bTime;
    });

  if (todaySchedules.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          Today's Classes
        </h2>
        <div className="text-center py-8">
          <ApperIcon name="Coffee" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No classes scheduled for today</p>
          <p className="text-sm text-gray-500 mt-1">Enjoy your free day! ☕</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
        Today's Classes ({todaySchedules.length})
      </h2>
      <div className="space-y-3">
{todaySchedules.map((schedule) => {
          const courseId = schedule.course_id_c?.Id || schedule.course_id_c;
          const course = courses.find(c => c.Id.toString() === courseId.toString());
          return (
            <div key={schedule.Id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div 
                className="w-3 h-16 rounded-full mr-4"
                style={{ backgroundColor: course?.color_c || "#6B7280" }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {course?.code_c || "Unknown Course"}
                </h3>
                <p className="text-gray-600">{course?.Name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  👨‍🏫 {course?.professor_c} • 📍 {schedule.location_c}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {schedule.start_time_c} - {schedule.end_time_c}
                </div>
                <div className="text-sm text-gray-500">
                  {parseInt(schedule.end_time_c?.split(":")[0] || "0") - parseInt(schedule.start_time_c?.split(":")[0] || "0")} hour{parseInt(schedule.end_time_c?.split(":")[0] || "0") - parseInt(schedule.start_time_c?.split(":")[0] || "0") > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const AddScheduleModal = ({ isOpen, onClose, onSubmit, courses }) => {
  const [formData, setFormData] = useState({
    course_id_c: "",
    day_of_week_c: "",
    start_time_c: "",
    end_time_c: "",
    location_c: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.dayOfWeek || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        courseId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        location: ""
      });
    } catch (error) {
      toast.error("Failed to add class time");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

const courseOptions = courses.map(course => ({
    value: course.Id.toString(),
    label: `${course.code_c} - ${course.Name}`
  }));

  const dayOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <Card className="relative inline-block w-full max-w-md p-0 my-8 text-left align-middle transition-all transform shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Add Class Time
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
<Select
              label="Course"
              value={formData.course_id_c}
              onChange={(e) => setFormData(prev => ({ ...prev, course_id_c: e.target.value }))}
              options={courseOptions}
              required
            />

            <Select
label="Day of Week"
              value={formData.day_of_week_c}
              onChange={(e) => setFormData(prev => ({ ...prev, day_of_week_c: e.target.value }))}
              options={dayOptions}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
label="Start Time"
                type="time"
                value={formData.start_time_c}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time_c: e.target.value }))}
                required
              />

              <Input
                label="End Time"
                type="time"
                value={formData.end_time_c}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time_c: e.target.value }))}
                required
              />
            </div>

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Room 101, Building A"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Add Class Time
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;