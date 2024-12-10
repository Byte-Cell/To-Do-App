import { Montserrat } from 'next/font/google';
import "./globals.css";
import { CompletedTasksProvider } from "../app/context/CompletedTasksContext";
import { DeletedTasksProvider } from "../app/context/DeletedTasksContext";
import { DarkModeProvider } from '../app/context/DarkModeContext';

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ['latin'],
});

export const metadata = {
  title: "Task Manager - Organize Your To-Do List",
  description: "Efficiently manage your tasks with a user-friendly to-do list app. Track, update, and delete tasks to stay organized and productive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <DarkModeProvider>
          <DeletedTasksProvider>
            <CompletedTasksProvider>
              {children}
            </CompletedTasksProvider>
          </DeletedTasksProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
