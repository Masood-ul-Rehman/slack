import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-Id";
import { useRouter } from "next/navigation";
const FormSchema = z.object({
  joinCode: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const InviteCodeInput = ({ code }: { code?: string }) => {
  const router = useRouter();
  const { workspaceId } = useWorkspaceId();
  const { mutate, isPending, data } = useJoinWorkspace();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      joinCode: code ? code : "",
    },
  });
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    mutate({ workspaceId, joinCode: formData.joinCode });
    if (!isPending && data?.success === true) {
      toast.success("Invite code verified");
      router.replace(`/workspace/${workspaceId}`);
    } else if (
      !isPending &&
      data?.error === "You are already a member of this workspace"
    ) {
      toast.error(`${data.error}`);
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isPending && data?.error) {
      toast.error(`${data.error}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="joinCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="md:w-20 md:h-20 md:text-2xl"
                    />
                    <InputOTPSlot
                      index={1}
                      className="md:w-20 md:h-20 md:text-2xl"
                    />
                    <InputOTPSlot
                      index={2}
                      className="md:w-20 md:h-20 md:text-2xl"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="">
                    <InputOTPSlot
                      index={3}
                      className="md:w-20 md:h-20 md:text-2xl"
                    />
                    <InputOTPSlot
                      index={4}
                      className="md:w-20 md:h-20 md:text-2xl"
                    />
                    <InputOTPSlot
                      index={5}
                      className="md:w-20 md:h-20 md:text-2xl"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-8 w-full font-semibold text-md"
          disabled={isPending}
          isLoading={isPending}
        >
          Verify invite code
        </Button>
      </form>
    </Form>
  );
};

export default InviteCodeInput;
