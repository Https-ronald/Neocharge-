export default function AdminTestPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Test Page</h1>
      <p>If you can see this page, the admin routing is working.</p>
      <p>Current time: {new Date().toISOString()}</p>
      <a href="/admin/login" style={{ color: "blue", textDecoration: "underline" }}>
        Go to Admin Login
      </a>
    </div>
  )
}
