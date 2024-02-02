// TODO: update code section.
import { Role } from "@prisma/client";

export async function verifyAccessCode(code) {
  console.log("code", code);
  try {
    const user = await prisma.adminCode.findUnique({
      where: {
        code,
      },
    });

    return { success: true, value: user, error: null };
  } catch (e) {
    console.log(" verify access code Error:", e);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = {
        code: error.code,
        message: error.message,
        target: error.meta,
      };

      console.log("verify access code prisma error:", prismaError);

      return { success: false, value: null, error: prismaError };
    } else {
      return { success: false, value: null, error: error };
    }
  }
}
