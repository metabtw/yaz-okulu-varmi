/**
 * PopularCoursesTable - En çok görüntülenen dersler tablosu.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { universityApi } from '@/lib/api';

interface Course {
  id: string;
  name: string;
  code: string;
  ects: number;
  price: number | null;
  currency: string;
  isOnline: boolean;
  viewCount: number;
  favoriteCount: number;
  applicationClicks: number;
  conversionRate: number;
}

export function PopularCoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    universityApi
      .getPopularCourses(10)
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popüler Dersler</CardTitle>
        <CardDescription>
          En çok görüntülenen ve en yüksek dönüşüm oranına sahip dersleriniz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ders Adı</TableHead>
              <TableHead>Kod</TableHead>
              <TableHead className="text-right">AKTS</TableHead>
              <TableHead className="text-right">Ücret</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead className="text-right">Görüntülenme</TableHead>
              <TableHead className="text-right">Favori</TableHead>
              <TableHead className="text-right">Başvuru</TableHead>
              <TableHead className="text-right">Dönüşüm</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-slate-500">
                  Henüz ders bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.code}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{course.ects}</TableCell>
                  <TableCell className="text-right">
                    {course.price != null
                      ? `${course.price} ${course.currency}`
                      : 'Ücretsiz'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={course.isOnline ? 'default' : 'outline'}
                    >
                      {course.isOnline ? 'Online' : 'Yüz Yüze'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {course.viewCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {course.favoriteCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {course.applicationClicks}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        course.conversionRate > 5 ? 'default' : 'secondary'
                      }
                    >
                      {course.conversionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/courses`}>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
