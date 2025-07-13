  import { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { X, Menu } from 'lucide-react';
  import { FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';

  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from '@/components/ui/sheet';
  import { useDispatch, useSelector } from 'react-redux';
  import toast from 'react-hot-toast';
  import { logout } from '../../store/userReducer';
  import { setSearchQuery } from '../../store/productReducer';

  const megaMenu = {
    Collection: {
      path: '/collection',
      sub: {
        Clothing: '/collection/clothing',
        Footwear: '/collection/footwear',
      },
    },
    Men: {
      path: '/mens',
      sub: {
        Clothing: '/mens/clothing',
        Footwear: '/mens/footwear',
      },
    },
    Women: {
      path: '/womens',
      sub: {
        Clothing: '/womens/clothing',
        Footwear: '/womens/footwear',
      },
    },
  };

  const Navbar = ({ cartItems }) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector(state => state.auth);

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (query.trim()) {
        dispatch(setSearchQuery(query.trim()));
        navigate(`/search`);
        setSearchOpen(false);
        setQuery('');
      } else {
        toast.error('Please enter a search term');
      }
    };

    const handleLinkClick = (e, path) => {
      e.preventDefault();
      navigate(path);
    };

    const handleLogout = async (e) => {
      e.preventDefault();
      try {
        await dispatch(logout()).unwrap();
        navigate('/');
      } catch (error) {
        toast.error(error.message);
      }
    };

    return (
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b bg-white sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl lg:h-[10vh] mx-auto px-2 py-3 flex justify-between items-center">
          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[260px] px-4 py-6 flex flex-col gap-6">
                <SheetHeader className="p-0">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Explore our categories and more</SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col gap-4">
                  {Object.entries(megaMenu).map(([categoryName, value]) => (
                    <div key={categoryName} className="space-y-1">
                      <Link
                        to={value.path}
                        className="text-sm font-semibold underline hover:text-black"
                      >
                        {categoryName}
                      </Link>

                      {/* Hide sub-links for 'Collection' */}
                      {categoryName !== 'Collection' && (
                        <div className="ml-2 flex flex-col gap-1">
                          {Object.entries(value.sub || {}).map(([sub, path]) => (
                            <Link
                              key={sub}
                              to={path}
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <hr className="my-2" />

                  <div className="flex flex-col gap-1">
                    <Link to="/about" className="text-sm font-medium hover:text-black">
                      About
                    </Link>
                    <Link to="/contact" className="text-sm font-medium hover:text-black">
                      Contact
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <span
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Link to="/" className="text-xl font-serif tracking-widest text-zinc-800">
              Snapbuy
            </Link>
            <p className="text-xs hidden md:block">The best place to buy products</p>
          </span>

          {/* Desktop Mega Menu */}
          <div className="hidden md:flex gap-6 text-sm font-medium items-center">
            {Object.entries(megaMenu).map(([categoryName, value]) => (
              <DropdownMenu key={categoryName} modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => handleLinkClick(e, value.path)}
                    className="px-2 py-1 text-gray-700 hover:text-black"
                  >
                    {categoryName}
                  </button>
                </DropdownMenuTrigger>

                {/* Hide dropdown content for 'Collection' */}
                {categoryName !== 'Collection' && (
                  <DropdownMenuContent align="start" className="w-40">
                    {Object.entries(value.sub || {}).map(([sub, path]) => (
                      <DropdownMenuItem key={sub} asChild>
                        <Link to={path}>{sub}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            ))}

            <Link to="/about" className="px-2 py-1 text-gray-700 hover:text-black">
              About
            </Link>
            <Link to="/contact" className="px-2 py-1 text-gray-700 hover:text-black">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-3">
            {user && isAuthenticated && user.role === 'admin' && (
              <Button
                onClick={() => navigate('/admin')}
                variant="ghost"
                className="border-1 border-gray-300"
              >
                Admin
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <FaSearch className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaUser className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {user && isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button onClick={handleLogout}>Logout</button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
                <FaShoppingBag className="w-5 h-5" />
              </Button>
              {cartItems?.length > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-white flex items-center justify-center px-4">
            <button onClick={() => setSearchOpen(false)} className="absolute top-5 right-6">
              <X className="h-6 w-6" />
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row  w-full max-w-3xl relative bottom-10 "
            >
              <input
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border px-4 py-3 w-full text-sm outline-none"
              />
              <Button type="submit" className="bg-rose-300 rounded-none text-white px-8 py-6">
                SEARCH
              </Button>
            </form>
          </div>
        )}

      </motion.div>
    );
  };

  export default Navbar;
