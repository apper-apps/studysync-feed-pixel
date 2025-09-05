import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";

const WeeklySchedule = ({ schedules = [], courses = [] }) => {
  const timeSlots = [
    "8:00", "9:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];
  
  const days = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" }
  ];

const getCourse = (courseId) => {
    const actualCourseId = courseId?.Id || courseId;
    return courses.find(c => c.Id.toString() === actualCourseId.toString());
  };

  const getScheduleForTimeAndDay = (time, day) => {
return schedules.find(schedule => {
      const startHour = parseInt(schedule.start_time_c?.split(":")[0] || "0");
      const timeHour = parseInt(time.split(":")[0]);
      const endHour = parseInt(schedule.end_time_c?.split(":")[0] || "0");
      
      return schedule.day_of_week_c?.toLowerCase() === day && 
             timeHour >= startHour && 
             timeHour < endHour;
    });
  };

const getScheduleDuration = (schedule) => {
    const startHour = parseInt(schedule.start_time_c?.split(":")[0] || "0");
    const endHour = parseInt(schedule.end_time_c?.split(":")[0] || "0");
    return endHour - startHour;
  };

const isScheduleStart = (schedule, time, day) => {
    const startHour = parseInt(schedule.start_time_c?.split(":")[0] || "0");
    const timeHour = parseInt(time.split(":")[0]);
    return schedule.day_of_week_c?.toLowerCase() === day && timeHour === startHour;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50">
              <span className="text-sm font-medium text-gray-900">Time</span>
            </div>
            {days.map((day) => (
              <div key={day.key} className="p-4 bg-gray-50 text-center">
                <span className="text-sm font-medium text-gray-900">{day.label}</span>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm text-gray-600">{time}</span>
              </div>
              
{days.map((day) => {
                const schedule = getScheduleForTimeAndDay(time, day.key);
                const course = schedule ? getCourse(schedule.course_id_c) : null;
                const isStart = schedule ? isScheduleStart(schedule, time, day.key) : false;
                const duration = schedule ? getScheduleDuration(schedule) : 1;
                
                if (schedule && !isStart) {
                  // This cell is part of a multi-hour class but not the start
                  return <div key={day.key} className="border-r border-gray-200 last:border-r-0" />;
                }
                
                return (
                  <div 
                    key={day.key} 
                    className="border-r border-gray-200 last:border-r-0 relative"
                    style={{ height: schedule && isStart ? `${duration * 64}px` : "64px" }}
                  >
                    {schedule && isStart && course && (
                      <div 
                        className="absolute inset-1 rounded-lg p-3 text-white text-sm overflow-hidden"
                        style={{ 
backgroundColor: course.color_c,
                          height: `${duration * 64 - 8}px`
                        }}
                      >
                        <div className="font-semibold">{course.code_c}</div>
                        <div className="text-xs opacity-90 mt-1">{course.Name}</div>
                        <div className="text-xs opacity-75 mt-2">
                          {schedule.start_time_c} - {schedule.end_time_c}
                        </div>
                        {schedule.location_c && (
                          <div className="text-xs opacity-75">
                            📍 {schedule.location_c}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeeklySchedule;