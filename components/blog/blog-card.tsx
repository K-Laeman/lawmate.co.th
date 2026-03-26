'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  blog: BlogPost;
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(blog.publishedDate).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Featured Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-blog.jpg';
          }}
        />
        <Badge className="absolute top-3 left-3 bg-primary">
          {blog.categoryLabel}
        </Badge>
        {blog.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-amber-500">
            แนะนำ
          </Badge>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{blog.readTime} นาที</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-navy-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {blog.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {blog.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <User className="w-4 h-4" />
          <span>{blog.author}</span>
        </div>

        {/* Read More Button */}
        <Button variant="outline" className="w-full mt-auto" asChild>
          <Link href={`/blogs/${blog.slug}`}>
            อ่านต่อ
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
