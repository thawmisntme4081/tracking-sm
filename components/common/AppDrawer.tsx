'use client';

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type Props = {
  title: string;
  labelBtn: string;
  children: ReactNode;
  description?: string;
  disabled?: boolean;
};

const AppDrawer = ({
  title,
  labelBtn,
  children,
  description,
  disabled,
}: Props) => {
  const [open, setOpen] = useState(false);

  const content = isValidElement(children)
    ? cloneElement(children as ReactElement<{ onCloseDrawer?: () => void }>, {
        onCloseDrawer: () => setOpen(false),
      })
    : children;

  if (disabled) {
    return null;
  }

  return (
    <Drawer direction="right" modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>{labelBtn}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        {content}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AppDrawer;
