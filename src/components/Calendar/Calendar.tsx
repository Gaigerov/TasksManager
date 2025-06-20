import React, { useState, useEffect } from 'react';
import styles from './Calendar.module.css';

interface CalendarProps {
  selectedDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  weekStart?: 0 | 1; // 0 - Sunday, 1 - Monday
  locale?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate = null,
  onDateChange,
  className = '',
  minDate,
  maxDate,
  weekStart = 1, // Monday as default
  locale = 'ru-RU'
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  
  // Set initial month to view
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  // Navigation
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'days') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'years') {
      newDate.setFullYear(newDate.getFullYear() + direction * 12);
    }
    setCurrentDate(newDate);
  };

  // Date selection
  const handleDateSelect = (date: Date) => {
    if (onDateChange) {
      onDateChange(date);
    }
  };

  // Month selection
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setViewMode('days');
  };

  // Year selection
  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setViewMode(viewMode === 'years' ? 'days' : 'months');
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = (firstDay.getDay() - weekStart + 7) % 7;
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isToday: isSameDay(date, new Date())
      });
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isToday: isSameDay(date, new Date())
      });
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks
    const nextDaysCount = totalCells - days.length;
    
    for (let day = 1; day <= nextDaysCount; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false
      });
    }
    
    return days;
  };

  // Helper functions
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Render methods
  const renderHeader = () => (
    <div className={styles.header}>
      <button 
        onClick={() => navigateMonth(-1)}
        className={styles.navButton}
        aria-label="Previous"
      >
        &lt;
      </button>
      
      <div className={styles.currentView}>
        {viewMode === 'days' && (
          <>
            <button 
              onClick={() => setViewMode('months')}
              className={styles.viewButton}
            >
              {currentDate.toLocaleString(locale, { month: 'long' })}
            </button>
            <button 
              onClick={() => setViewMode('years')}
              className={styles.viewButton}
            >
              {currentDate.getFullYear()}
            </button>
          </>
        )}
        
        {viewMode === 'months' && (
          <span>{currentDate.getFullYear()}</span>
        )}
        
        {viewMode === 'years' && (
          <span>{`${currentDate.getFullYear() - 6} - ${currentDate.getFullYear() + 5}`}</span>
        )}
      </div>
      
      <button 
        onClick={() => navigateMonth(1)}
        className={styles.navButton}
        aria-label="Next"
      >
        &gt;
      </button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const days = [];
    const date = new Date(2023, 0, weekStart === 0 ? 1 : 2); // Sunday or Monday
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className={styles.weekDay}>
          {date.toLocaleString(locale, { weekday: 'short' })}
        </div>
      );
      date.setDate(date.getDate() + 1);
    }
    
    return <div className={styles.weekDays}>{days}</div>;
  };

  const renderDays = () => {
    const days = getDaysInMonth();
    
    return (
      <div className={styles.daysGrid}>
        {days.map((day, index) => (
          <button
            key={index}
            className={`${styles.day} 
              ${day.isCurrentMonth ? '' : styles.otherMonth} 
              ${day.isSelected ? styles.selected : ''}
              ${day.isToday ? styles.today : ''}
              ${isDateDisabled(day.date) ? styles.disabled : ''}
            `}
            onClick={() => day.isCurrentMonth && !isDateDisabled(day.date) && handleDateSelect(day.date)}
            disabled={isDateDisabled(day.date)}
            aria-label={day.date.toLocaleDateString(locale)}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>
    );
  };

  const renderMonths = () => {
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      const isDisabled = 
        (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) ||
        (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1));
      
      months.push(
        <button
          key={i}
          className={`${styles.month} ${i === currentDate.getMonth() ? styles.selected : ''}`}
          onClick={() => handleMonthSelect(i)}
          disabled={isDisabled}
        >
          {date.toLocaleString(locale, { month: 'short' })}
        </button>
      );
    }
    
    return <div className={styles.monthsGrid}>{months}</div>;
  };

  const renderYears = () => {
    const years = [];
    const startYear = currentDate.getFullYear() - 6;
    
    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      const date = new Date(year, 0, 1);
      const isDisabled = 
        (minDate && year < minDate.getFullYear()) ||
        (maxDate && year > maxDate.getFullYear());
      
      years.push(
        <button
          key={year}
          className={`${styles.year} ${year === currentDate.getFullYear() ? styles.selected : ''}`}
          onClick={() => handleYearSelect(year)}
          disabled={isDisabled}
        >
          {year}
        </button>
      );
    }
    
    return <div className={styles.yearsGrid}>{years}</div>;
  };

  return (
    <div className={`${styles.calendar} ${className}`}>
      {renderHeader()}
      
      {viewMode === 'days' && (
        <>
          {renderDaysOfWeek()}
          {renderDays()}
        </>
      )}
      
      {viewMode === 'months' && renderMonths()}
      {viewMode === 'years' && renderYears()}
    </div>
  );
};

export default Calendar;
