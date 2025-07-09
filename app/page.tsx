import { getTodayCSEngineer } from '@/app/actions/csEngineer';
import HomeClient from '@/app/components/HomeClient';
 
export default async function Home() {
  const engineer = await getTodayCSEngineer();
  return <HomeClient engineer={engineer} />;
} 