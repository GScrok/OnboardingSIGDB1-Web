export class AppRoutes {
  static readonly PATHS = {
    COMPANY: {
      ROOT: 'company',
      NEW: 'new',
      EDIT: 'edit',
      EDIT_ID: 'edit/:id',
    },
    EMPLOYEE: {
      ROOT: 'employee',
      NEW: 'new',
      EDIT: 'edit',
      EDIT_ID: 'edit/:id',
      LINK_COMPANY: 'link-company',
      LINK_COMPANY_ID: 'link-company/:id',
      LINK_ROLE: 'link-role',
      LINK_ROLE_ID: 'link-role/:id',
      ROLE_HISTORY: 'role-history',
      ROLE_HISTORY_ID: 'role-history/:id',
    },
    ROLE: {
      ROOT: 'role',
      NEW: 'new',
      EDIT: 'edit',
      EDIT_ID: 'edit/:id',
    }
  };

  static readonly LINKS = {
    COMPANY: {
      LIST: ['/', AppRoutes.PATHS.COMPANY.ROOT],
      NEW: ['/', AppRoutes.PATHS.COMPANY.ROOT, AppRoutes.PATHS.COMPANY.NEW],
      EDIT: (id: string | number) => ['/', AppRoutes.PATHS.COMPANY.ROOT, AppRoutes.PATHS.COMPANY.EDIT, id],
    },
    EMPLOYEE: {
      LIST:['/', AppRoutes.PATHS.EMPLOYEE.ROOT],
      NEW: ['/', AppRoutes.PATHS.EMPLOYEE.ROOT, AppRoutes.PATHS.EMPLOYEE.NEW],
      EDIT: (id: string | number) => ['/', AppRoutes.PATHS.EMPLOYEE.ROOT, AppRoutes.PATHS.EMPLOYEE.EDIT, id],
      LINK_COMPANY: (id: string | number) => ['/', AppRoutes.PATHS.EMPLOYEE.ROOT, AppRoutes.PATHS.EMPLOYEE.LINK_COMPANY, id],
      LINK_ROLE: (id: string | number) => ['/', AppRoutes.PATHS.EMPLOYEE.ROOT, AppRoutes.PATHS.EMPLOYEE.LINK_ROLE, id],
      ROLE_HISTORY: (id: string | number) => ['/', AppRoutes.PATHS.EMPLOYEE.ROOT, AppRoutes.PATHS.EMPLOYEE.ROLE_HISTORY, id],
    },
    ROLE: {
      LIST: ['/', AppRoutes.PATHS.ROLE.ROOT],
      NEW: ['/', AppRoutes.PATHS.ROLE.ROOT, AppRoutes.PATHS.ROLE.NEW],
      EDIT: (id: string | number) => ['/', AppRoutes.PATHS.ROLE.ROOT, AppRoutes.PATHS.ROLE.EDIT, id],
    }
  };
}
