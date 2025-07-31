import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-elegant-white">
      <Header />
      <Menu />
      <Footer />
    </main>
  );
}
