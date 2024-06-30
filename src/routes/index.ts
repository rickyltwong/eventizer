function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/admin';

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  default: path(ROOTS_DASHBOARD, '/analytics'),
  events: path(ROOTS_DASHBOARD, '/events'),
  tickets: path(ROOTS_DASHBOARD, '/tickets'),
  users: path(ROOTS_DASHBOARD, '/usermanagement'),
  attendees: path(ROOTS_DASHBOARD, '/attendee'),
};




