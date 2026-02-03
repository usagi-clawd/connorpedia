import MainPage from './components/MainPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Main Page - Connorpedia',
  description: 'Welcome to Connorpedia, the personal encyclopedia of Connor Daly',
};

export default function Home() {
  return <MainPage />;
}
