// Run the tests in a time zone ahead of UTC (UTC+9, no daylight saving time). Date bugs that come from mixing local
// and UTC time, such as saving the day before the one picked, only show up there, and CI runs in UTC.
// This must be set before the test workers start: inside a test, process.env is a copy.
module.exports = () => {
  process.env.TZ = 'Asia/Tokyo';
};
