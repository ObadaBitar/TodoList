"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TaskList {
  value: number;
  label: string;
}

interface ComboboxProps {
  options: TaskList[];
  placeholder?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function Combobox({
  options,
  placeholder = "Select task list...",
  value: controlledValue,
  defaultValue,
  onChange,
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue || 0)

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: number) => {
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[250px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            {/* TODO: ADD LOADING NOTFICATION */}
            <CommandEmpty>No task lists found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={(selectedValue) => {
                    console.log("onSelect fired:", selectedValue);
                    const numValue = Number(selectedValue);
                    handleValueChange(numValue);
                    setOpen(false);
                  }}
                  onClick={() => {
                    console.log("onClick fired for:", option.label, option.value);
                    handleValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
