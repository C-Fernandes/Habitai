import { useState } from "react";
import Calendar, { type CalendarProps } from "react-calendar";
import styles from './visitsCalendar.module.css';

interface VisitsCalendarProps {
    visitsDates: string[];
    onSelectDate: (date: Date) => void;
}

type CalendarValue = Date | Date[] | null;

export function VisitsCalendar({ visitsDates, onSelectDate }: VisitsCalendarProps) {
    const [value, setValue] = useState<Date>(new Date());

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            if (visitsDates.includes(dateStr)) {
                return styles.hasVisit;
            }
        }
        return '';
    };

    // @ts-ignore
    const handleChange: CalendarProps['onChange'] = (val: CalendarValue) => {
        if (!val) return;
        let date: Date;
        if (Array.isArray(val)) {
            date = val[0];
        } else {
            date = val;
        }
        setValue(date);
        onSelectDate(date);
    };

    return (
        <div className={styles.calendarWrapper}>
            <Calendar
                onChange={handleChange}
                value={value}
                tileClassName={tileClassName}
            />
        </div>
    );
}
