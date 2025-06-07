const Task = require("../models/Task");
const User = require("../models/User");
const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

// Generate task report based on type (daily/weekly/monthly) and user
exports.generateReport = async (req, res) => {
  try {
    // const { type, userId } = req.params; // userId from params is no longer used for filtering authenticated requests
    const { type } = req.params;
    const { date } = req.query; // Get date from query parameters

    // Get logged-in user's ID and role from the request (set by authentication middleware)
    const loggedInUser = req.user;

    if (!loggedInUser) {
        return res.status(401).json({ message: "User not authenticated." });
    }

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

    // Build the query object based on user role
    const filter = {
      $or: [
        {
          createdAt: { 
            $gte: startDate, 
            $lte: endDate 
          }
        },
        {
          dueDate: {
            $gte: startDate,
            $lte: endDate
          }
        }
      ]
    };

    console.log('Mongoose query filter:', filter);

    // Filter by createdBy for admins, assignedTo for regular users
    if (loggedInUser.role === 'admin') {
        filter.createdBy = loggedInUser.id; // Filter by tasks created by the admin
    } else {
        filter.assignedTo = loggedInUser.id; // Filter by tasks assigned to the regular user
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('dependencies', 'title status');

    console.log('Fetched tasks statuses:', tasks.map(task => task.status));

    // Filter for in-progress tasks specifically
    const inProgressTasks = tasks.filter(task => task.status === 'in progress');

    // Calculate summary data
    const statusData = tasks.reduce((acc, task) => {
        const validStatusMap = {
            'completed': 'completed',
            'pending': 'pending',
            'overdue': 'overdue',
            'in progress': 'inProgress', // Map lowercase status to camelCase key
        };

        const taskStatus = task.status ? task.status.toLowerCase() : '';
        const mappedStatus = validStatusMap[taskStatus];

        if (mappedStatus) {
             acc[mappedStatus] = (acc[mappedStatus] || 0) + 1; // Increment the count for the mapped camelCase key
        } else {
             console.warn(`Task with unexpected status encountered (ID: ${task._id}): ${task.status}`);
        }
        return acc;
    }, { completed: 0, pending: 0, overdue: 0, inProgress: 0 }); // Initialize with camelCase key

    // Send the response in the expected format
    res.json({
        tasks: tasks,
        statusData: statusData, // Send the directly populated statusData
        inProgressTasks: inProgressTasks
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
