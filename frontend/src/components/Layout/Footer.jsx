const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <p className="text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} Loan Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
