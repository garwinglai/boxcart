import { options } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

// Used in getServerSideProps...
export async function isAuth(context, next) {
  const session = await getServerSession(
    context.req,
    context.res,
    options(context.req, context.res)
  );
  const serializedSession = JSON.parse(JSON.stringify(session));

  if (!session || !session.user) {
    return {
      redirect: {
        destination:
          process.env.NODE_ENV && process.env.NODE_ENV === "production"
            ? "/app/auth/signin"
            : "http://localhost:3000/app/auth/signin",
        permanent: false,
      },
    };
  }

  return next(serializedSession);
}

export async function isAuthUserAccount(context, next) {
  const { req, res } = context;
  const session = await getServerSession(
    req,
    res,
    options(context.req, context.res)
  );

  const serializedSession = JSON.parse(JSON.stringify(session));

  if (!session || !session.user) {
    return {
      redirect: {
        destination:
          process.env.NODE_ENV && process.env.NODE_ENV === "production"
            ? "/user/auth/signin"
            : "http://localhost:3000/user/auth/signin",
        permanent: false,
      },
    };
  }

  return next(serializedSession);
}

export async function isAuthUserShopping(context, next) {
  const { req, res } = context;
  const session = await getServerSession(
    req,
    res,
    options(context.req, context.res)
  );
  const serializedSession = JSON.parse(JSON.stringify(session));

  return next(serializedSession);
}
