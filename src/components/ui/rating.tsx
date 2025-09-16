"use client"

import { Rating as ReactRating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

interface RatingProps {
  value: number
  readOnly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export function Rating({
  value,
  readOnly = false,
  onChange,
  className,
}: RatingProps) {
  return (
    <ReactRating
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      className={className}
      itemStyles={{
        itemShapes: (
          <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 8.48548 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 16.7227 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 16.3912 19.618L12.5255 17.1635C12.2034 16.9599 11.7966 16.9599 11.4745 17.1635L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 14.1161C7.27729 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 9.59942 3.07796 8.48548 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 7.80979 9.35068 7.45955L11.0748 3.25583Z" />
        ),
        activeFillColor: '#f59e0b',
        inactiveFillColor: '#d1d5db',
      }}
      style={{ maxWidth: 100 }}
    />
  )
}