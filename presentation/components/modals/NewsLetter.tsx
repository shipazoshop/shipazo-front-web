"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type NewsletterStatus = {
  success: boolean;
  messageVisible: boolean;
};

export default function NewsLetter() {
  const modalElement = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<NewsletterStatus>({
    success: true,
    messageVisible: false,
  });

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let mounted = true;

    const showModal = async () => {
      const bootstrap = await import("bootstrap");
      const element = modalElement.current;
      if (!element || !mounted) {
        return;
      }

      const modalInstance = new bootstrap.Modal(element, {
        keyboard: false,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (!mounted) {
        return;
      }

      modalInstance.show();

      const handleHidden = () => {
        modalInstance.hide();
        setStatus((previous) => ({ ...previous, messageVisible: false }));
      };

      element.addEventListener("hidden.bs.modal", handleHidden);

      cleanup = () => {
        element.removeEventListener("hidden.bs.modal", handleHidden);
        modalInstance.hide();
      };
    };

    void showModal();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  const handleShowMessage = (success: boolean) => {
    setStatus({ success, messageVisible: true });
    window.setTimeout(() => {
      setStatus((previous) => ({ ...previous, messageVisible: false }));
    }, 2000);
  };

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (typeof email !== "string") {
      handleShowMessage(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        form.reset();
        handleShowMessage(true);
      } else {
        handleShowMessage(false);
      }
    } catch (error) {
      console.error("Newsletter subscription failed", error);
      handleShowMessage(false);
      form.reset();
    }
  };

  return (
    <div
      ref={modalElement}
      id="newsletterPopup"
      className="modal modalCentered fade auto-popup modal-def modal-newleter"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center">
          <span
            className="icon icon-close icon-close-popup link"
            data-bs-dismiss="modal"
          />
          <div className="heading">
            <h5 className="fw-semibold">Join our newsletter for $10 offs</h5>
            <p className="body-md-2">
              Register now to get latest updates on promotions &amp; coupons.
              <br />
              Don’t worry, we will not spam!
            </p>
          </div>
          <div
            className={`tfSubscribeMsg  footer-sub-element ${
              status.messageVisible ? "active" : ""
            }`}
          >
            {status.success ? (
              <p style={{ color: "rgb(52, 168, 83)" }}>
                You have successfully subscribed.
              </p>
            ) : (
              <p style={{ color: "red" }}>Something went wrong</p>
            )}
          </div>
          <form onSubmit={sendEmail} className="form-sub">
            <div className="form-content">
              <fieldset>
                <input
                  type="email"
                  id="mail"
                  name="email"
                  placeholder="Enter Your Email Address"
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <div className="box-btn">
              <button type="submit" className="tf-btn w-100">
                <span className="text-white">Subscribe</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
