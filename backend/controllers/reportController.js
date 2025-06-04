const Task = require("../models/Task");
const User = require("../models/User");
const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

// Generate task report based on type (daily/weekly/monthly) and user
exports.generateReport = async (req, res) => {
  try {
    const { type, userId } = req.params;
    const { date } = req.query; // Get date from query parameters

    let startDate;
    let endDate = dayjs.utc(date).endOf('day').toDate(); // Default end date to end of the selected day (UTC)

    if (!date) {
        return res.status(400).json({ message: "Date query parameter is required" });
    }

    const selectedDate = dayjs.utc(date);

    if (!selectedDate.isValid()) {
         return res.status(400).json({ message: "Invalid date format" }); // Corrected error message
     }

    switch (type) {
        case "daily":
            startDate = selectedDate.startOf('day').toDate();
            endDate = selectedDate.endOf('day').toDate();
            break;
        case "weekly":
            startDate = selectedDate.startOf('week').toDate(); // start of the week
            endDate = selectedDate.endOf('week').toDate(); // end of the week
            break;
        case "monthly":
            startDate = selectedDate.startOf('month').toDate(); // start of the month
            endDate = selectedDate.endOf('month').toDate(); // end of the month
            break;
        default:
            return res.status(400).json({ message: "Invalid report type" });
    }

    // Build the query object
    const tasks = await Task.find({
      // Only filter by assignedTo if userId is not 'all'
      ...(userId !== 'all' && { assignedTo: userId }),
      createdAt: { 
        $gte: startDate, 
        $lte: endDate 
      },
    });

    // Calculate summary data
    const statusData = tasks.reduce((acc, task) => {
        // Assuming task has a 'status' field (e.g., 'completed', 'pending', 'overdue')
        // Initialize status properties if they don't exist
        if (!acc[task.status]) { acc[task.status] = 0; }
        acc[task.status]++;
        return acc;
    }, { completed: 0, pending: 0, overdue: 0 });

    // Send the response in the expected format
    res.json({
        tasks: tasks,
        statusData: statusData
    });

   } catch (error) {
     console.error("Report generation error:", error);
     res.status(500).json({ message: "Error generating report", error: error.message });
   }
};

// Function to insert dummy tasks
exports.insertDummyTasks = async (req, res) => {
    try {
        // First, find or create a test user
        let testUser = await User.findOne({ email: 'test@example.com' });
        
        if (!testUser) {
            testUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Test@123', // This should be hashed in a real scenario
                role: 'user'
            });
        }

        const dummyTasks = [
            {
                title: 'Dummy Task 1 (Completed)',
                status: 'completed',
                description: 'Description for dummy task 1',
                createdAt: dayjs.utc().subtract(2, 'day').toDate(),
                dueDate: dayjs.utc().add(1, 'day').toDate(),
                assignedTo: testUser._id
            },
            {
                title: 'Dummy Task 2 (Pending)',
                status: 'pending',
                description: 'Description for dummy task 2',
                createdAt: dayjs.utc().subtract(1, 'day').toDate(),
                dueDate: dayjs.utc().add(2, 'day').toDate(),
                assignedTo: testUser._id
            },
            {
                title: 'Dummy Task 3 (In Progress)',
                status: 'in progress',
                description: 'Description for dummy task 3',
                createdAt: dayjs.utc().subtract(5, 'day').toDate(),
                dueDate: dayjs.utc().subtract(1, 'day').toDate(),
                assignedTo: testUser._id
            },
            {
                title: 'Dummy Task 4 (Completed this week)',
                status: 'completed',
                description: 'Description for dummy task 4',
                createdAt: dayjs.utc().startOf('week').add(1, 'day').toDate(),
                dueDate: dayjs.utc().endOf('week').toDate(),
                assignedTo: testUser._id
            },
            {
                title: 'Dummy Task 5 (In Progress this month)',
                status: 'in progress',
                description: 'Description for dummy task 5',
                createdAt: dayjs.utc().startOf('month').add(5, 'day').toDate(),
                dueDate: dayjs.utc().endOf('month').toDate(),
                assignedTo: testUser._id
            },
            {
  title: 'Dummy Task 6 (Matches June 3)',
  status: 'pending',
  description: 'Description for dummy task 6',
  createdAt: dayjs.utc('2025-06-03T12:00:00Z').toDate(),
  dueDate: dayjs.utc('2025-06-05T00:00:00Z').toDate(),
  assignedTo: testUser._id
}

        ];

        // Remove existing dummy tasks to avoid duplicates on multiple runs
        await Task.deleteMany({ title: { $regex: /^Dummy Task/ } });

        const createdTasks = await Task.insertMany(dummyTasks);

        res.status(201).json({ 
            message: 'Dummy tasks inserted successfully', 
            count: createdTasks.length,
            userId: testUser._id
        });
    } catch (error) {
        console.error('Error inserting dummy tasks:', error);
        res.status(500).json({ message: 'Error inserting dummy tasks', error: error.message });
    }
};

exports.getReportSummary = async (req, res) => {
  // Placeholder implementation
  res.json({ message: "Summary endpoint works!" });
};
