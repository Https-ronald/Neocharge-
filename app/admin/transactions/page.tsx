import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, Search, Download, Filter } from "lucide-react"

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-gray-500">Monitor and manage all transactions on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and filter all transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="grid w-full gap-2 md:max-w-sm">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input id="search" placeholder="Search by user, transaction ID..." className="pl-8" />
                </div>
              </div>
              <div className="grid w-full gap-2 md:max-w-[180px]">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-2 md:max-w-[180px]">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-2 md:max-w-[180px]">
                <Label htmlFor="date">Date Range</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="date">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">TX-12345</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                        <span>Credit</span>
                      </div>
                    </TableCell>
                    <TableCell>Wallet Funding</TableCell>
                    <TableCell>May 10, 2023 10:45 AM</TableCell>
                    <TableCell className="font-medium text-green-600">+₦10,000.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
                        Completed
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TX-12344</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                        <span>Debit</span>
                      </div>
                    </TableCell>
                    <TableCell>Airtime Purchase</TableCell>
                    <TableCell>May 10, 2023 09:30 AM</TableCell>
                    <TableCell className="font-medium text-red-600">-₦1,000.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
                        Completed
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TX-12343</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                        <span>Debit</span>
                      </div>
                    </TableCell>
                    <TableCell>Data Bundle</TableCell>
                    <TableCell>May 9, 2023 04:15 PM</TableCell>
                    <TableCell className="font-medium text-red-600">-₦2,500.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
                        Completed
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TX-12342</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                        <span>Debit</span>
                      </div>
                    </TableCell>
                    <TableCell>DSTV Subscription</TableCell>
                    <TableCell>May 9, 2023 02:30 PM</TableCell>
                    <TableCell className="font-medium text-red-600">-₦6,800.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
                        Completed
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TX-12341</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                        <span>Credit</span>
                      </div>
                    </TableCell>
                    <TableCell>Wallet Funding</TableCell>
                    <TableCell>May 8, 2023 11:20 AM</TableCell>
                    <TableCell className="font-medium text-green-600">+₦15,000.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-200">
                        Completed
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TX-12340</TableCell>
                    <TableCell>Michael Johnson</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                        <span>Credit</span>
                      </div>
                    </TableCell>
                    <TableCell>Wallet Funding</TableCell>
                    <TableCell>May 8, 2023 10:15 AM</TableCell>
                    <TableCell className="font-medium text-green-600">+₦5,000.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600 border-yellow-200">
                        Pending
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TX-12339</TableCell>
                    <TableCell>Sarah Williams</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                        <span>Debit</span>
                      </div>
                    </TableCell>
                    <TableCell>Electricity Bill</TableCell>
                    <TableCell>May 7, 2023 03:45 PM</TableCell>
                    <TableCell className="font-medium text-red-600">-₦8,500.00</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600 border-red-200">
                        Failed
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <strong>1-7</strong> of <strong>120</strong> transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-600">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
