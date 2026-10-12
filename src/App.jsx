import React, { createContext, useContext, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LibraryBig, ArrowLeftRight, Users, LogOut, Search, Plus, Pencil, Trash2, Sparkles, AlertTriangle, CheckCircle2, X, Menu, Boxes, BookMarked } from 'lucide-react';
import { useLocalStorage, initialBooks, initialUsers } from './hooks.js';

const LibraryContext = createContext(null);
const useLibrary = () => useContext(LibraryContext);

function App() {
  const [books, setBooks] = useLocalStorage('bb_books', initialBooks);
  const [users, setUsers] = useLocalStorage('bb_users', initialUsers);
  const [transactions, setTransactions] = useLocalStorage('bb_transactions', []);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState('');
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const value = useMemo(() => ({ books, setBooks, users, setUsers, transactions, setTransactions, currentUser, setCurrentUser, notify }), [books, users, transactions, currentUser]);
  return <LibraryContext.Provider value={value}>
    {!currentUser ? <Login /> : <AppRoutes />}
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </LibraryContext.Provider>;
}

function Login() {
  const { users, setCurrentUser } = useLibrary();
  const [membershipId, setMembershipId] = useState('ADMIN');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const user = users.find((item) => item.membershipId.toLowerCase() === membershipId.trim().toLowerCase() && item.password === password);
    if (!user) { setError('That membership ID or password is not correct.'); return; }
    setCurrentUser(user); setError('');
  };
  return <main className="login-screen">
    <section className="login-card">
      <div className="login-logo"><BookOpen size={32}/><Sparkles className="logo-sparkle" size={17}/></div>
      <span className="eyebrow">WELCOME TO YOUR NEXT ADVENTURE</span>
      <h1>Book<span>Buddy</span></h1>
      <p className="muted">A bright little corner for big adventures.</p>
      <form onSubmit={submit} className="login-form">
        <label htmlFor="membershipIdLogin">Membership ID</label>
        <input id="membershipIdLogin" value={membershipId} onChange={e=>setMembershipId(e.target.value)} placeholder="e.g. BB001" required />
        <label htmlFor="passwordLogin">Password</label>
        <input id="passwordLogin" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" required />
        {error && <p className="error-text" role="alert">{error}</p>}
        <button className="primary-btn full-btn" type="submit">Enter Library <span>→</span></button>
      </form>
      <div className="demo-login"><b>Demo login</b><span>ADMIN / 1234</span><span>BB001 / 1234</span></div>
      <div className="login-decoration"><span>📚</span><span>⭐</span><span>🌈</span></div>
    </section>
    <aside className="login-art"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-book-stack"><div className="big-book book-purple"><BookOpen size={44}/></div><div className="big-book book-pink"></div><div className="big-book book-yellow"></div></div><div className="art-note"><Sparkles size={17}/> Every book opens a new world!</div><div className="floating-star star-one">✦</div><div className="floating-star star-two">✧</div></aside>
  </main>;
}

function AppRoutes() {
  const { currentUser, setCurrentUser } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/books', label: 'Books', icon: BookOpen },
    { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { to: '/members', label: 'Members', icon: Users }
  ];
  const pageNames = { '/': 'Dashboard', '/books': 'Book shelf', '/transactions': 'Transactions', '/members': 'Library members' };
  const logout = () => { setCurrentUser(null); navigate('/'); };
  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={()=>setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-icon"><BookOpen size={24}/></div><div><strong>BookBuddy</strong><small>COMMUNITY LIBRARY</small></div><button className="close-menu" onClick={()=>setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="menu-label">YOUR WORKSPACE</div>
      <nav className="side-nav">{navItems.map(({to,label,icon:Icon})=><button key={to} className={`nav-btn ${location.pathname===to?'active':''}`} onClick={()=>{navigate(to);setMobileOpen(false)}}><Icon size={19}/><span>{label}</span>{location.pathname===to&&<span className="active-dot"/>}</button>)}</nav>
      <div className="sidebar-tip"><div className="tip-icon">💡</div><b>Little library tip</b><p>Every book is a new adventure waiting to happen.</p></div>
      <div className="sidebar-bottom"><div className="side-user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div><div className="side-user"><b>{currentUser.name}</b><small>{currentUser.role}</small></div><button className="logout-icon" onClick={logout} title="Log out" aria-label="Log out"><LogOut size={18}/></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu size={22}/></button><div><span className="eyebrow">YOUR LITTLE LIBRARY, WELL ORGANISED</span><h2>{pageNames[location.pathname] || 'BookBuddy'}</h2></div><div className="top-profile"><div className="profile-avatar">{currentUser.name.charAt(0).toUpperCase()}</div><div><b>{currentUser.name}</b><small>{currentUser.role}</small></div></div></header>
      <div className="page-content"><Routes><Route path="/" element={<Dashboard/>}/><Route path="/books" element={<BooksPage/>}/><Route path="/transactions" element={<TransactionsPage/>}/><Route path="/members" element={<MembersPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></div>
      <footer className="footer">Made for curious minds <span>✦</span> BookBuddy Community Library</footer>
    </main>
  </div>;
}

function PageHeading({ eyebrow, title, description, action }) { return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3>{description&&<p className="muted">{description}</p>}</div>{action}</div>; }
function Dashboard() {
  const { books, users, transactions } = useLibrary();
  const totalCopies = books.reduce((sum, book)=>sum + Number(book.quantity), 0);
  const borrowed = transactions.filter(t=>t.type==='Borrowed').reduce((sum,t)=>sum+t.quantity,0);
  const lowStock = books.filter(b=>Number(b.quantity)<2);
  return <>
    <section className="hero-banner"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={15}/> READY, SET, READ!</span><h1>Let's discover a<br/>new <em>story.</em></h1><p>Keep your shelves organised and help every young reader find their next favourite book.</p><div className="hero-pills"><span>✦ Read a little every day</span><span>✦ Imagine without limits</span></div></div><div className="hero-illustration"><div className="hero-sun"></div><div className="hero-plant">✿</div><div className="hero-books"><div className="hero-book hb-one"></div><div className="hero-book hb-two"></div><div className="hero-book hb-three"><BookOpen size={29}/></div><div className="hero-book hb-four"></div></div><div className="hero-sparkle">✦</div><div className="hero-star">✧</div></div></section>
    <div className="stats-grid">
      <StatCard icon={LibraryBig} label="Book titles" value={books.length} tone="purple" note="Different stories to explore"/>
      <StatCard icon={Boxes} label="Available copies" value={totalCopies} tone="blue" note="Copies currently on the shelf"/>
      <StatCard icon={BookMarked} label="Borrowed copies" value={borrowed} tone="pink" note="Total copies borrowed in logs"/>
      <StatCard icon={Users} label="Library members" value={users.length} tone="yellow" note="Registered reader accounts"/>
    </div>
    {lowStock.length>0&&<section className="low-stock-alert"><div className="alert-icon"><AlertTriangle size={20}/></div><div><b>Some shelves need a little love</b><p>{lowStock.map(b=>b.title).join(', ')} {lowStock.length===1?'has':'have'} fewer than 2 copies available.</p></div></section>}
    <PageHeading eyebrow="YOUR SHELF" title="Popular books" description="A little peek at the stories in your collection." action={<Link className="text-link" to="/books">View all books <span>→</span></Link>}/>
    <div className="dashboard-book-grid">{books.slice(0,4).map((book,i)=><BookTile key={book.id} book={book} index={i}/>)}</div>
    <section className="reading-note"><span className="reading-note-icon">🌟</span><div><b>A little reminder</b><p>Every young reader deserves a story that makes their imagination grow.</p></div></section>
  </>;
}
function StatCard({icon:Icon,label,value,tone,note}) { return <article className={`stat-card stat-${tone}`}><div className="stat-top"><span className="stat-icon"><Icon size={20}/></span><span className="stat-decoration">✦</span></div><small>{label}</small><strong>{value}</strong><p>{note}</p></article>; }
function BookTile({book,index}) { const covers=['cover-purple','cover-blue','cover-pink','cover-yellow']; return <article className="book-tile"><div className={`book-cover ${covers[index%covers.length]}`}><span className="cover-stars">✦ ✧</span><BookOpen size={34}/><span className="cover-title">{book.title}</span></div><div className="book-tile-info"><h4>{book.title}</h4><p>by {book.author}</p><div className="book-tile-bottom"><span className="genre-pill">{book.genre}</span><span className={book.quantity<2?'stock-low':'stock-ok'}>{book.quantity} left</span></div></div></article>; }

function BooksPage() {
  const { books, setBooks, notify } = useLibrary();
  const [search, setSearch] = useState(''); const [genre, setGenre] = useState(''); const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState(null);
  const blank = {title:'',author:'',genre:'',isbn:'',quantity:'1'};
  const [form, setForm] = useState(blank); const [formError, setFormError] = useState('');
  const genres = [...new Set(books.map(b=>b.genre).filter(Boolean))];
  const filtered = books.filter(b=>(`${b.title} ${b.author} ${b.genre} ${b.isbn}`).toLowerCase().includes(search.toLowerCase())&&(!genre||b.genre===genre));
  const startAdd = () => {setEditingId(null);setForm(blank);setFormError('');setShowForm(true);};
  const startEdit = (book) => {setEditingId(book.id);setForm({...book,quantity:String(book.quantity)});setFormError('');setShowForm(true);window.scrollTo({top:0,behavior:'smooth'});};
  const submit = e => {e.preventDefault();const quantity=Number(form.quantity);if(!form.title.trim()||!form.author.trim()||!form.genre.trim()||!form.isbn.trim()||!Number.isInteger(quantity)||quantity<0){setFormError('Please complete every field and enter a whole quantity of 0 or more.');return;}if(books.some(b=>b.isbn.trim().toLowerCase()===form.isbn.trim().toLowerCase()&&b.id!==editingId)){setFormError('A book with this ISBN already exists.');return;}if(editingId){setBooks(books.map(b=>b.id===editingId?{...b,...form,title:form.title.trim(),author:form.author.trim(),genre:form.genre.trim(),isbn:form.isbn.trim(),quantity}:b));notify('Book details updated!');}else{setBooks([...books,{...form,id:Date.now(),title:form.title.trim(),author:form.author.trim(),genre:form.genre.trim(),isbn:form.isbn.trim(),quantity}]);notify('A new book joined the shelf!');}setShowForm(false);setForm(blank);setEditingId(null);setFormError('');};
  const remove = book => {if(window.confirm(`Delete “${book.title}” from the library?`)){setBooks(books.filter(b=>b.id!==book.id));notify('Book removed from the shelf.');}};
  return <>
    <PageHeading eyebrow="BOOK MANAGEMENT" title="Your book shelf" description="Add stories, update details, and keep an eye on every copy." action={<button className="primary-btn" onClick={startAdd}><Plus size={18}/> Add new book</button>}/>
    {showForm&&<section className="form-panel"><div className="form-title-row"><div><span className="eyebrow">BOOK DETAILS</span><h3>{editingId?'Update book':'Add a new book'}</h3></div><button className="icon-btn" onClick={()=>setShowForm(false)} aria-label="Close form"><X size={19}/></button></div><form onSubmit={submit} className="form-grid"><Field label="Book title"><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. The Secret Garden" required/></Field><Field label="Author"><input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Author's full name" required/></Field><Field label="Genre"><input value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} placeholder="e.g. Adventure" required/></Field><Field label="ISBN"><input value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} placeholder="Book ISBN" required/></Field><Field label="Initial quantity"><input type="number" min="0" step="1" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required/></Field>{formError&&<p className="error-text form-error">{formError}</p>}<div className="form-actions"><button className="primary-btn" type="submit">{editingId?'Save changes':'Save book'}</button><button className="secondary-btn" type="button" onClick={()=>setShowForm(false)}>Cancel</button></div></form></section>}
    <div className="toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, author, genre or ISBN..." aria-label="Search books"/></div><select value={genre} onChange={e=>setGenre(e.target.value)} aria-label="Filter by genre"><option value="">All genres</option>{genres.map(g=><option key={g}>{g}</option>)}</select><span className="result-count">{filtered.length} {filtered.length===1?'book':'books'}</span></div>
    <div className="table-card"><div className="table-responsive"><table><thead><tr><th>BOOK DETAILS</th><th>GENRE</th><th>ISBN</th><th>AVAILABLE</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(book=><tr key={book.id}><td><div className="table-book"><div className="mini-book-icon"><BookOpen size={18}/></div><div><b>{book.title}</b><small>by {book.author}</small></div></div></td><td><span className="genre-pill">{book.genre}</span></td><td>{book.isbn}</td><td><span className={book.quantity<2?'stock-low':'stock-ok'}>{book.quantity} {book.quantity===1?'copy':'copies'}</span></td><td><div className="action-group"><button className="action-btn edit" onClick={()=>startEdit(book)}><Pencil size={15}/> Edit</button><button className="action-btn delete" onClick={()=>remove(book)}><Trash2 size={15}/> Delete</button></div></td></tr>)}</tbody></table>{filtered.length===0&&<EmptyState title="No books found" text="Try another search or add a new book to the shelf."/>}</div></div>
  </>;
}
function Field({label,children}) {return <label className="field"><span>{label}</span>{children}</label>;}
function TransactionsPage() {
  const {books,setBooks,transactions,setTransactions,notify}=useLibrary();
  const [bookId,setBookId]=useState('');const [quantity,setQuantity]=useState('1');const [error,setError]=useState('');
  const changeStock = (direction) => {const qty=Number(quantity);const book=books.find(b=>String(b.id)===String(bookId));if(!book){setError('Please choose a book first.');return;}if(!Number.isInteger(qty)||qty<1){setError('Quantity must be a whole number greater than zero.');return;}if(direction<0&&book.quantity<qty){setError(`Only ${book.quantity} ${book.quantity===1?'copy is':'copies are'} available.`);return;}const updatedBook={...book,quantity:book.quantity+direction*qty};setBooks(books.map(b=>b.id===book.id?updatedBook:b));setTransactions([{id:Date.now(),book:book.title,type:direction>0?'Added':'Borrowed',quantity:qty,date:new Date().toLocaleDateString(),time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})},...transactions]);setError('');notify(direction>0?'New stock added successfully!':'Borrowing recorded successfully!');setQuantity('1');};
  return <>
    <PageHeading eyebrow="STOCK CONTROL" title="Book transactions" description="Record new arrivals and borrowed books. Stock updates automatically."/>
    <div className="transaction-layout"><section className="form-panel transaction-form-panel"><div className="panel-icon purple-icon"><ArrowLeftRight size={21}/></div><h3>Update book stock</h3><p className="muted">Choose a title and enter how many copies you want to add or lend.</p><form onSubmit={e=>e.preventDefault()}><Field label="Choose a book"><select value={bookId} onChange={e=>{setBookId(e.target.value);setError('')}} required><option value="">Select a book...</option>{books.map(b=><option key={b.id} value={b.id}>{b.title} — {b.quantity} available</option>)}</select></Field><Field label="Number of copies"><input type="number" min="1" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} required/></Field>{bookId&&<div className="availability-preview"><BookOpen size={18}/><span>Currently available</span><b>{books.find(b=>String(b.id)===String(bookId))?.quantity??0}</b></div>}{error&&<p className="error-text" role="alert">{error}</p>}<div className="stock-buttons"><button className="primary-btn" type="button" onClick={()=>changeStock(1)}><Plus size={17}/> Add stock</button><button className="pink-btn" type="button" onClick={()=>changeStock(-1)}><BookMarked size={17}/> Borrow copies</button></div></form></section><aside className="transaction-side-card"><div className="side-card-art">📚<span>✦</span></div><span className="eyebrow">A LITTLE LIBRARY MAGIC</span><h3>Every copy counts.</h3><p>When a reader borrows a book, the available quantity goes down. When new copies arrive, add them here to keep your shelf up to date.</p><div className="transaction-mini-stats"><div><b>{books.length}</b><span>Titles</span></div><div><b>{books.reduce((s,b)=>s+b.quantity,0)}</b><span>Available copies</span></div></div></aside></div>
    <PageHeading eyebrow="RECENT ACTIVITY" title="Transaction history" description="A record of every stock addition and borrowing action."/>
    <div className="table-card"><div className="table-responsive"><table><thead><tr><th>DATE & TIME</th><th>BOOK</th><th>TRANSACTION</th><th>QUANTITY</th></tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td><b>{t.date}</b><small className="cell-subtext">{t.time||''}</small></td><td><b>{t.book}</b></td><td><span className={`transaction-badge ${t.type==='Added'?'added':'borrowed'}`}>{t.type==='Added'?<Plus size={14}/>:<BookMarked size={14}/>} {t.type}</span></td><td><b>{t.quantity}</b></td></tr>)}</tbody></table>{transactions.length===0&&<EmptyState title="No transactions yet" text="Your stock additions and borrowings will appear here."/>}</div></div>
  </>;
}
function MembersPage() {
  const {users,setUsers,currentUser,notify}=useLibrary();
  const [showForm,setShowForm]=useState(false);const [editingId,setEditingId]=useState(null);const blank={name:'',membershipId:'',role:'Member',password:''};const [form,setForm]=useState(blank);const [error,setError]=useState('');
  const canManage=currentUser.role==='Admin'||currentUser.role==='Librarian';
  const startAdd=()=>{setEditingId(null);setForm(blank);setError('');setShowForm(true);};
  const startEdit=u=>{setEditingId(u.id);setForm({...u,password:u.password||''});setError('');setShowForm(true);};
  const submit=e=>{e.preventDefault();if(!form.name.trim()||!form.membershipId.trim()||!form.password){setError('Please complete all fields.');return;}if(users.some(u=>u.membershipId.toLowerCase()===form.membershipId.trim().toLowerCase()&&u.id!==editingId)){setError('This membership ID is already in use.');return;}if(editingId){setUsers(users.map(u=>u.id===editingId?{...u,...form,name:form.name.trim(),membershipId:form.membershipId.trim()}:u));notify('Member details updated!');}else{setUsers([...users,{...form,id:Date.now(),name:form.name.trim(),membershipId:form.membershipId.trim()}]);notify('New member added!');}setShowForm(false);setForm(blank);setEditingId(null);setError('');};
  const remove=u=>{if(u.id===currentUser.id){window.alert('You cannot delete the account you are currently using.');return;}if(window.confirm(`Delete member ${u.name}?`)){setUsers(users.filter(x=>x.id!==u.id));notify('Member removed.');}};
  return <>
    <PageHeading eyebrow="USER MANAGEMENT" title="Library members" description="Manage membership accounts and their library roles." action={canManage&&<button className="primary-btn" onClick={startAdd}><Plus size={18}/> Add member</button>}/>
    {!canManage&&<div className="permission-note"><AlertTriangle size={19}/><div><b>Read-only member list</b><p>Only an Admin or Librarian account can add, edit, or delete members.</p></div></div>}
    {showForm&&canManage&&<section className="form-panel"><div className="form-title-row"><div><span className="eyebrow">MEMBER DETAILS</span><h3>{editingId?'Update member':'Register a new member'}</h3></div><button className="icon-btn" onClick={()=>setShowForm(false)} aria-label="Close form"><X size={19}/></button></div><form onSubmit={submit} className="form-grid"><Field label="Full name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Member's full name" required/></Field><Field label="Membership ID"><input value={form.membershipId} onChange={e=>setForm({...form,membershipId:e.target.value})} placeholder="e.g. BB002" required/></Field><Field label="Role"><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Member</option><option>Librarian</option><option>Admin</option></select></Field><Field label="Password"><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Create a password" required/></Field>{error&&<p className="error-text form-error">{error}</p>}<div className="form-actions"><button className="primary-btn" type="submit">{editingId?'Save changes':'Save member'}</button><button className="secondary-btn" type="button" onClick={()=>setShowForm(false)}>Cancel</button></div></form></section>}
    <div className="member-summary"><div className="member-summary-icon"><Users size={21}/></div><div><b>{users.length} registered {users.length===1?'member':'members'}</b><p>Membership accounts saved on this device.</p></div><span className="member-summary-pill">{users.filter(u=>u.role==='Admin').length} admin</span></div>
    <div className="table-card"><div className="table-responsive"><table><thead><tr><th>MEMBER</th><th>MEMBERSHIP ID</th><th>ROLE</th>{canManage&&<th>ACTIONS</th>}</tr></thead><tbody>{users.map(u=><tr key={u.id}><td><div className="table-book"><div className="member-avatar">{u.name.charAt(0).toUpperCase()}</div><div><b>{u.name}</b><small>{u.id===currentUser.id?'Signed in account':'BookBuddy reader'}</small></div></div></td><td><span className="membership-code">{u.membershipId}</span></td><td><span className={`role-pill ${u.role.toLowerCase()}`}>{u.role}</span></td>{canManage&&<td><div className="action-group"><button className="action-btn edit" onClick={()=>startEdit(u)}><Pencil size={15}/> Edit</button><button className="action-btn delete" onClick={()=>remove(u)}><Trash2 size={15}/> Delete</button></div></td>}</tr>)}</tbody></table></div></div>
    <p className="security-note"><span>🔒</span> This is a learning demo. Account details are stored in your browser's local storage and are not suitable for real sensitive information.</p>
  </>;
}
function EmptyState({title,text}) {return <div className="empty-state"><div className="empty-icon"><BookOpen size={25}/></div><b>{title}</b><p>{text}</p></div>;}

export default App;
