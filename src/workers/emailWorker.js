import { Worker } from 'bullmq';
import connection from '../config/redisConfig.js';
import sendEmail from '../utils/sendEmail.js';
import UserModel from '../models/User.js';
import connectDB from '../config/databaseConfig.js';

connectDB()

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    if(job.name === 'authorNotification'){

      const { authorId, purchaseDetails } = job.data;
      const author = await UserModel.findById({_id:authorId._id});
      if (!author) {
        console.log(`Author with ID ${authorId._id} not found`);
        return;
      }
      
      const html = `
      <p>Hi ${author.name},</p>
      <p>Your book "${purchaseDetails.bookTitle}" was purchased!</p>
      <p>Details:</p>
      <ul>
      <li>Quantity: ${purchaseDetails.quantity}</li>
      <li>Price: ${purchaseDetails.price*purchaseDetails.quantity}</li>
      <li>Total Revenue: ${author.revenue}</li>
      </ul>
      `;
      
      await sendEmail({
        to: author.email,
        subject: `Your book "${purchaseDetails.bookTitle}" was purchased!`,
        html,
      });
      
      console.log(`Email sent to ${author.email}`);
    }

    if (job.name === 'newBookNotification') {
      const { userEmail, bookTitle, authorName } = job.data;

      const html = `
        <p>Hi,</p>
        <p>Exciting news! A new book "${bookTitle}" by ${authorName} has just been released!</p>
        <p>Check it out on our bookstore now.</p>
      `;

      await sendEmail({
        to: userEmail,
        subject: `New Book Released: ${bookTitle}`,
        html,
      });

      console.log(`New book email sent to ${userEmail}`);
    }
  },
  {
    connection,
    limiter: {
      max: 100,          
      duration: 60000,   
    },
  }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
