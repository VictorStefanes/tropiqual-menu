import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-elegant-white dark:bg-dark-bg transition-colors duration-300">
      <ThemeToggle />
      <Header />
      <Menu />
      <Footer />
    </main>
  );
}
