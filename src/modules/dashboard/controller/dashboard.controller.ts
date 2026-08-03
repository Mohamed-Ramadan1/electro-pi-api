import { Controller } from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // will collecting data from multi  notes for the dashboard (notes , projects , tasks )
  dashboardFeed() {}

  //  data shape we needs here is
}
