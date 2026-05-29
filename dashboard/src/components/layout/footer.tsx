export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-sidebar-border">
      <div className="container flex justify-between items-center p-4 md:px-6">
        <p className="text-xs text-muted-foreground md:text-sm">
          © {currentYear} Job Tracker
        </p>
        <p className="text-xs text-muted-foreground md:text-sm">
          Queens Gets The Money
        </p>
      </div>
    </footer>
  )
}
