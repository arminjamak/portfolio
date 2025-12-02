# Admin CMS System Plan

## User Request
Add a complete admin CMS system with:
- Admin login modal in footer (email: jamakarmin@gmail.com, password: Carbovaris2011)
- Admin state management across the site
- Add new projects on home page (title, tagline, cover image)
- Edit content on project detail and about pages (Squarespace-style)
- Add/remove text chunks with formatting (h1, h2, body)
- Add/upload images
- Save functionality
- Logout option in footer when logged in

## Related Files
- @/polymet/layouts/portfolio-layout (to add Admin/Logout button in footer)
- @/polymet/components/admin-login-modal (to create) - Login modal component
- @/polymet/components/admin-context (to create) - Admin state management
- @/polymet/components/add-project-modal (to create) - Add new project modal
- @/polymet/components/content-editor (to create) - Squarespace-style content editor
- @/polymet/pages/home (to update) - Add admin controls for new projects
- @/polymet/pages/project-detail (to update) - Add edit functionality
- @/polymet/pages/about (to update) - Add edit functionality
- @/polymet/data/projects-data (to update) - Add functions for CRUD operations
- @/polymet/prototypes/portfolio-prototype (to update) - Wrap with admin context

## TODO List
- [x] Create admin context for state management
- [x] Create admin login modal component
- [x] Update layout footer with Admin/Logout button
- [x] Wrap prototype with admin context provider
- [x] Create add project modal component
- [x] Create content editor component for Squarespace-style editing
- [x] Update home page with admin controls
- [x] Update project-detail page with edit functionality
- [x] Update about page with edit functionality
- [ ] Test all admin functionality end-to-end

## Important Notes
- Use React Context API for admin state management
- Store admin state in localStorage for persistence
- Credentials: jamakarmin@gmail.com / Carbovaris2011
- Content editor should support: h1, h2, body text, and image uploads
- Save functionality should update the data layer
- Admin controls should only be visible when logged in

  
## Plan Information
*This plan is created when the project is at iteration 12, and date 2025-11-06T03:18:58.811Z*
