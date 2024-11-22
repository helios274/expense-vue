const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} ExpenseVue. All rights reserved.
        </div>
        <div className="space-x-4 mt-4 md:mt-0">
          <a href="#privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
