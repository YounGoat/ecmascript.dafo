
'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    , getDayOfYear = require('./getDayOfYear')
    ;

/**
 * Get the week of the year, 0..53 in default mode 0.
 * @param {Date}     d
 * @param {number}  [mode=0]
 * 
 * -- READMORE --
 * https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_week
 *     The following table describes how the mode argument works.
 *     Mode	First day of week	Range	Week 1 is the first week …
 *     0	Sunday	0-53	with a Sunday in this year
 *     1	Monday	0-53	with 4 or more days this year
 *     2	Sunday	1-53	with a Sunday in this year
 *     3	Monday	1-53	with 4 or more days this year
 *     4	Sunday	0-53	with 4 or more days this year
 *     5	Monday	0-53	with a Monday in this year
 *     6	Sunday	1-53	with 4 or more days this year
 *     7	Monday	1-53	with a Monday in this year
 * 
 */
function getYearWeek(d, mode = 0) {
    // Get the weekday of Jan 1st.
    let Jan1st = new Date(d);
    Jan1st.setMonth(0);
    Jan1st.setDate(1);
    let weekdayOfJan1st = Jan1st.getDay();

    // The offset from Jan 1st to the first day of week 1.
    // 0 means Jan 1st is just the first day of week 1.
    // Negative offset means the first day of week 1 is actually in last year.
    let week1Offset = null;
    
    // First day of week: Sunday
    // Week 1 is the first week with a Sunday in this year. Namely, 
    // Week 1 is the first week with a Thursday in this year.
    if (mode == 0 || mode == 2) {
        week1Offset = (7 - weekdayOfJan1st) % 7;
    } 

    // First day of week: Monday
    // Week 1 is the first week with a Monday in this year.
    else if (mode == 5 || mode == 7) {
        week1Offset = (8 - weekdayOfJan1st) % 7;
    }

    // First day of week: Sunday
    // Week 1 is the first week with 4 or more days this year.
    else if (mode == 4 || mode == 6) {
        week1Offset = [0,1,2,3].includes(weekdayOfJan1st) 
            ? 0 - weekdayOfJan1st
            : 7 - weekdayOfJan1st
            ;
    } 

    // First day of week: Monday
    // Week 1 is the first week with 4 or more days this year.
    else if (mode == 1 || mode == 3) {
        week1Offset = [1,2,3,4].includes(weekdayOfJan1st) 
            ? 1 - weekdayOfJan1st
            : (8 - weekdayOfJan1st) % 7
            ;
    }
    
    let year = d.getFullYear();
    let daysOfYear = getDayOfYear(d);

    // In these modes, dates before week 1 belong to the last week of last year.
    if (daysOfYear <= week1Offset && [2,3,6,7].includes(mode)) {
        let Dec31st = new Date(Jan1st);
        Dec31st.setDate(0);
        return getYearWeek(Dec31st, mode);
    }
    else {
        let week = Math.ceil((daysOfYear - week1Offset) /  7);
        if (week == 0) week = 0; // Avoid -0.
        return { year, week };
    }
}

module.exports = getYearWeek;